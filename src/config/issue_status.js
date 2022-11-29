const ISSUE_STATUS_NR2STR = {
  0: "❌ Not started",
  1: "▶️ In progress",
  2: "✅ Done",
}

const ISSUE_STATUS_RANKING = [1, 0, 2]

const ISSUE_STATUS = {
  not_started: { id: 0, rank: 1 },
  in_progress: { id: 1, rank: 0 },
  done: { id: 2, rank: 2 },
}

module.exports = { ISSUE_STATUS, ISSUE_STATUS_NR2STR, ISSUE_STATUS_RANKING }
