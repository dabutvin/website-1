workflow "New workflow" {
  on = "push"
  resolves = ["NOTICE file generator"]
}

action "NOTICE file generator" {
  uses = "dabutvin/chive-action@max-pr-body"
  secrets = ["GITHUB_TOKEN"]
  args = "--filename=TPN.md"
}
