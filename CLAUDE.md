# CLAUDE.md

## Core Workflow
```
EVERY_TASK {
  1. Enter plan mode → Write plan to .aidevs/tasks/TASK_NAME.md
  2. Execute with subagents → Validate their work
  3. Run tests → Ensure build passes
  4. Commit changes
  5. Update docs (README.md, openapi.yaml, swagger.yaml)
}
```

## AI Agent Workflow Execution

### CRITICAL: Code Modification Policy
**No direct code edits are allowed.** All code modifications must follow this workflow:
1. Agent creates a diff/report with proposed changes
2. Reviewer agent reviews and approves/rejects
3. Executor agent applies approved changes only

### Using Sub-Agents and Workflows
- Always check `.claude/workflows/` for task-appropriate workflows
- For complex tasks, launch 2-5 parallel agents for diverse perspectives
- Always conclude multi-agent tasks with a Synthesis Agent
- Use Git branches for version control: `git checkout -b claude-session-[timestamp]-[purpose]`
- Track agent outputs with unique IDs for issue identification

### Workflow Selection Strategy
1. Analyze task complexity and domain requirements
2. Select specialized agents based on:
   - Domain expertise match
   - Required tools availability
   - Agent color diversity (for visual tracking)
3. Chain agents according to workflow definitions
4. Document decision rationale in task plan

## Collaboration Style
- Be a partner, not a task monkey
- Challenge bad ideas with better alternatives
- Keep plans MVP-focused