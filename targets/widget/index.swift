import SwiftUI
import WidgetKit

// Keep these in sync with src/features/widget/widget-data.ts.
private let appGroup = "group.metadots.bobble.app"
private let payloadKey = "bobbleWidgetPayload"
private let deepLink = URL(string: "bobble:///tasks")

// MARK: - Data

struct WidgetPayload: Decodable {
  let dayKey: String
  let total: Int
  let completed: Int
  let mood: String
  let message: String
  let nextTaskTitle: String
  let nextTaskTime: String
}

/// Reads the payload written by the app via ExtensionStorage.
/// Returns nil when missing or computed for a previous day.
private func loadTodayPayload() -> WidgetPayload? {
  guard
    let raw = UserDefaults(suiteName: appGroup)?.string(forKey: payloadKey),
    let data = raw.data(using: .utf8),
    let payload = try? JSONDecoder().decode(WidgetPayload.self, from: data)
  else { return nil }

  let formatter = DateFormatter()
  formatter.dateFormat = "yyyy-MM-dd"
  return payload.dayKey == formatter.string(from: Date()) ? payload : nil
}

struct BobbleEntry: TimelineEntry {
  let date: Date
  let payload: WidgetPayload?
}

struct BobbleTimelineProvider: TimelineProvider {
  func placeholder(in context: Context) -> BobbleEntry {
    BobbleEntry(
      date: Date(),
      payload: WidgetPayload(
        dayKey: "", total: 5, completed: 2, mood: "working",
        message: "Keep the momentum going!", nextTaskTitle: "Call the bank", nextTaskTime: "3:00 PM"))
  }

  func getSnapshot(in context: Context, completion: @escaping (BobbleEntry) -> Void) {
    completion(BobbleEntry(date: Date(), payload: loadTodayPayload()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<BobbleEntry>) -> Void) {
    let entry = BobbleEntry(date: Date(), payload: loadTodayPayload())
    // Re-run at the next midnight so a new day resets the widget to its neutral state.
    let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
    let midnight = Calendar.current.startOfDay(for: tomorrow)
    completion(Timeline(entries: [entry], policy: .after(midnight)))
  }
}

// MARK: - Views

struct BobbleWidgetView: View {
  @Environment(\.widgetFamily) var family
  let entry: BobbleEntry

  private var mascotName: String {
    switch entry.payload?.mood {
    case "starting": return "mascot-starting"
    case "working": return "mascot-working"
    case "almost": return "mascot-almost"
    case "done": return "mascot-done"
    default: return "mascot-empty"
    }
  }

  private var headline: String {
    guard let payload = entry.payload, payload.total > 0 else { return "Hi there!" }
    return "\(payload.completed)/\(payload.total)"
  }

  private var subtitle: String {
    entry.payload?.message ?? "Open Bobble to plan your day"
  }

  private var nextTaskLine: String? {
    guard let payload = entry.payload, !payload.nextTaskTitle.isEmpty else { return nil }
    return payload.nextTaskTime.isEmpty
      ? "Next: \(payload.nextTaskTitle)"
      : "Next: \(payload.nextTaskTitle) · \(payload.nextTaskTime)"
  }

  private var progress: Double {
    guard let payload = entry.payload, payload.total > 0 else { return 0 }
    return min(Double(payload.completed) / Double(payload.total), 1)
  }

  var body: some View {
    Group {
      switch family {
      case .systemMedium: mediumView
      default: smallView
      }
    }
    .widgetURL(deepLink)
    .containerBackground(for: .widget) {
      LinearGradient(
        colors: [Color("gradientTop"), Color("gradientBottom")],
        startPoint: .topLeading,
        endPoint: .bottomTrailing)
    }
  }

  private var smallView: some View {
    ZStack(alignment: .bottomTrailing) {
      Image(mascotName)
        .resizable()
        .scaledToFit()
        .frame(width: 64, height: 64)

      VStack(alignment: .leading, spacing: 2) {
        Text("Today's Tasks")
          .font(.caption2)
          .foregroundStyle(.white.opacity(0.85))
        Text(headline)
          .font(.system(size: 30, weight: .bold, design: .rounded))
          .foregroundStyle(.white)
        Spacer(minLength: 0)
        Text(subtitle)
          .font(.caption2)
          .fontWeight(.semibold)
          .foregroundStyle(.white)
          .lineLimit(2)
          .padding(.trailing, 56)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
  }

  private var mediumView: some View {
    HStack(spacing: 14) {
      VStack(alignment: .leading, spacing: 4) {
        Text("Today's Tasks")
          .font(.caption)
          .foregroundStyle(.white.opacity(0.85))
        Text(headline)
          .font(.system(size: 28, weight: .bold, design: .rounded))
          .foregroundStyle(.white)
        Text(subtitle)
          .font(.footnote)
          .fontWeight(.semibold)
          .foregroundStyle(.white)
          .lineLimit(1)
        if let nextTaskLine {
          Text(nextTaskLine)
            .font(.caption2)
            .foregroundStyle(.white.opacity(0.85))
            .lineLimit(1)
        }
        ProgressView(value: progress)
          .tint(.white)
          .padding(.top, 2)
      }
      .frame(maxWidth: .infinity, alignment: .leading)

      Image(mascotName)
        .resizable()
        .scaledToFit()
        .frame(width: 92, height: 92)
    }
  }
}

// MARK: - Widget

struct BobbleTasksWidget: Widget {
  let kind = "BobbleTasksWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: BobbleTimelineProvider()) { entry in
      BobbleWidgetView(entry: entry)
    }
    .configurationDisplayName("Bobble Tasks")
    .description("See today's tasks and your Bobble's mood at a glance.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

@main
struct BobbleWidgetBundle: WidgetBundle {
  var body: some Widget {
    BobbleTasksWidget()
  }
}
