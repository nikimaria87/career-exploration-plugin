# Explore Yourself: assessment editing and role scenarios

**Status: proposal for review, not implemented.**

Prepared October 28, 2026, against NextJobber plugin 1.4.0 and the current application source. This document records the first requested Explore Yourself update batch. It does not authorize application changes, a new deployment, a standalone website, subscription setup, or a paid-feature gate.

## Requested direction

1. Let users add items to existing assessments.
2. Add a Scenarios entry in Explore Yourself, with a job-title dropdown populated from the user's saved details.
3. Have ChatGPT facilitate realistic, interactive work scenarios for the selected role.
4. Encourage independent responses and review disclosed assistance without promising reliable AI detection.
5. Give feedback after completion on time, demonstrated skills, strengths, improvement areas, role readiness, and possible experience-building roles.
6. Mark **role scenarios as a planned paid feature for a later release**. Keep payment and subscription work outside this batch.

## Feasibility and current behavior

| Request | Current state | Proposed approach |
| --- | --- | --- |
| Add questions to a custom assessment | Available now, up to 50 questions | Use Explore Yourself → Your custom assessments → Edit → Add question → Save assessment |
| Add questions to one of the four built-in assessments through the UI | Not currently available | Add **Customize a copy** so users can extend a private version without editing the shared original |
| Change the standard assessment for every user | Possible through application source changes | Make this a separate owner-maintained, versioned change; retain historical definitions and results |
| Select a saved job title | The profile already stores `targetRoles` | Reuse that field for the dropdown; provide an obvious route to edit saved job titles |
| Generate and facilitate realistic scenarios | Feasible through the ChatGPT plugin | Start with a ChatGPT-led session connected to saved scenario records |
| Work through questions, new information and decisions | Feasible | Use a staged session that supports clarification, decisions, consequences and completion |
| Measure time | Feasible with recorded session events | Report elapsed time and instrumented response time separately; label unmeasured time honestly |
| Reliably identify every AI-assisted answer | Cannot be guaranteed | Use an independence agreement, assistance disclosure and reasoning follow-ups; no definitive detector verdict |
| Give immediate feedback | Feasible after the final response | ChatGPT creates a structured, evidence-linked report in the same session and saves it |
| Determine whether someone is a strong job candidate | A scenario alone is insufficient | Report practice evidence and readiness; compare actual experience and job requirements before discussing candidacy |

### How to add assessment items today

For an existing custom assessment:

1. Sign in and open **Explore Yourself**.
2. Under **Your custom assessments**, select **Edit**.
3. Select **Add question**, enter its wording and scoring category, and repeat as needed.
4. Use **Move up / Move down** to set the order, then **Save assessment**.

The current editor supports 1–50 questions, five rating labels, instructions and scoring categories. Questions in a category share the existing unweighted 1–5 scoring method. A category needs at least half its questions answered to display a score. Editing a custom template applies to future attempts; completed custom attempts retain their definition snapshot.

The four built-in questionnaires are currently defined in [`lib/career/assessments.ts`](../../lib/career/assessments.ts). They have no direct edit button. A code change can extend the standard version, but changing question sets must include definition versioning and preserve the interpretation of earlier results.

### Proposed built-in customization experience

- Add **Customize a copy** beside each built-in questionnaire.
- Copy its title, instructions, rating labels, question IDs and categories into a new private custom template.
- Open the existing editor, where the user can add questions or change wording.
- Record the source questionnaire and source version as provenance for the copy.
- Label the result as a customized reflection. Do not imply that changed questions retain the meaning or comparability of the standard questionnaire.
- Keep the original available and preserve existing completed results.
- Keep the current 50-question limit for this batch. A larger limit can be considered separately.

An owner changing the shared question bank is a different operation from a user customizing a private copy. This proposal prioritizes private copies; owner-wide changes should have an explicit version and migration plan.

## Role scenarios: proposed user journey

1. **Open Scenarios.** Add an entry within Explore Yourself. Initially label it as a preview; track its future paid status in the feature roadmap/configuration.
2. **Choose a job title.** Populate the dropdown from the signed-in user's saved `targetRoles`. If no titles exist, explain how to add them in the profile/details area. Do not silently substitute unrelated roles.
3. **Choose the context.** Confirm experience level and an approximate session length. Ask about jurisdiction only when the case requires it. Offer a non-sensitive case by default and a separate opt-in for sensitive workplace topics.
4. **Agree to independent practice.** Ask the user to respond in their own words and disclose outside help. Explain the limits of monitoring before the session starts.
5. **Generate the scenario.** ChatGPT creates a fictional role-appropriate situation with explicit objectives, constraints and a behavior-based feedback rubric.
6. **Work one step at a time.** Present the situation and one main question. Let the user request relevant information, explain their reasoning, make a decision and respond to new facts or consequences.
7. **Finish the case.** Cover the planned stages, including reflection on the user's final decision. Do not stop after one answer and call that a completed scenario.
8. **Receive feedback.** ChatGPT produces the report after the final response, using actual recorded answers and measured timing.
9. **Save and revisit.** Show the report in the dashboard, allow resuming an unfinished session, and offer another practice case or a learning plan.

### Where the AI conversation would run

The current dashboard stores data and exposes tools; it does not independently run a language model. The first implementation should therefore be **ChatGPT-led**:

- The dashboard provides role selection, session setup, launch/resume instructions and saved reports.
- The NextJobber plugin generates the case, conducts the conversation and records progress through authenticated tools.
- The dashboard and plugin read the same private session records.
- A short session reference in the launch prompt links the conversation to the right saved session. Possession of that reference must not grant another account access.

This approach builds on the existing plugin without adding a separate model API integration. It does require a clear handoff into ChatGPT and a connected NextJobber plugin. A website-contained live AI conversation is a separate implementation choice with its own integration, availability and operating-cost decisions; it must not be implied by a dashboard button alone.

## Scenario design and useful additions

Recommended initial defaults, subject to review:

- Around 3–8 stages, adjusted to the role and desired session length.
- A mix of information gathering, prioritization, communication, decision-making and reflection.
- Difficulty appropriate to entry-level, intermediate or experienced practice. Do not assume managerial competence from a desired title alone.
- A clear fictional workplace and a bounded problem, rather than a generic interview question.
- Follow-ups that adapt to the user's actual choices while retaining consistent feedback criteria.
- Pause/resume and an untimed option. Speed should not automatically increase or reduce readiness feedback.
- An independent mode that defers coaching until completion. A coached learning mode is a possible later enhancement and should be clearly distinguished.
- Multiple comparable cases for repeat practice. One successful attempt should not become a permanent ability label.

These are training/reflection experiences, not validated aptitude tests, employer screening tools or certifications.

### Example: Human Resources Manager

The requested example is feasible as a fictional, non-graphic sensitive workplace case. A scenario could involve an employee reporting alleged sexual assault by a direct supervisor, then progress through:

1. Receiving the report and clarifying immediate concerns.
2. Requesting relevant information and deciding which resources or policies are needed.
3. Choosing an appropriate escalation and documentation approach.
4. Responding to a new development or a competing stakeholder request.
5. Explaining follow-up, communication and review of the decision.

The facilitator should obtain opt-in before presenting sensitive material, offer an alternative case, and ask the user not to enter real employee names or confidential complaint records. Use fictional facts and avoid graphic detail.

Case generation and feedback should draw on current, jurisdiction-appropriate sources and employer policies. For a U.S. example, EEOC materials describe prompt, impartial investigation, appropriate corrective action, confidentiality limits and protection against retaliation. Those materials inform the practice rubric; they do not establish one universally correct script or certify legal compliance. Do not present a fictional exercise as advice for handling a real complaint.

## Independent work and assistance review

The goal is to understand the user's own reasoning. **Automatic, reliable proof of AI use is not a feasible requirement.**

Recommended monitoring:

- State the independent-work expectation before starting.
- Ask for a simple assistance declaration, such as no outside help, outside help used, unsure, or not disclosed. Allow accessibility tools without requiring medical details.
- Preserve the user's original responses for feedback; do not rewrite or run them through the resume cleanup/humanization workflow before evaluation.
- Ask the user to explain a decision, reconcile an inconsistency, or respond to a changed constraint.
- Record assistance that the user discloses, and distinguish it from unverified observations.
- Use neutral labels such as **self-reported independent work** or **assistance not independently verified**.

The system cannot monitor other tabs, external AI services, clipboard use, or offscreen work inside an ordinary ChatGPT conversation. Timing and writing style are not proof of AI assistance. The first version should not include hidden surveillance or an automated cheating penalty.

If an external detector is considered later, review its false positives, language bias, privacy, cost and validation first. Do not send responses to a third-party detector without explicit user authorization. A detector result must never be the sole basis for a readiness conclusion or an accusation.

## Timing and feedback report

### Timing

Record timestamps on the server for session start, step presentation, user submission, explicit pause/resume and completion. Distinguish:

- **Total elapsed time:** wall-clock duration of the session.
- **Recorded response-window time:** time between step presentation and response, subtracting recorded pauses and model/tool waiting where the implementation can measure them.
- **Unknown/unmeasured time:** offscreen activity or timing not captured by the host.

ChatGPT must not invent timestamps or infer exact duration from message count. Label response-window time as an estimate of time spent responding, not a measurement of concentration. Exclude time from readiness ratings unless an appropriate, reviewed role-specific reason is established.

### Report contents

| Report section | Expected content |
| --- | --- |
| Session context | Selected role, case title, difficulty, scenario/rubric version and completion state |
| Timing | Measured totals, recorded pauses and timing limitations |
| Strengths | Specific effective actions with references to the user's responses |
| Demonstrated skills | Observed skills and supporting decisions or quotations |
| Improvement areas | Missed considerations, why they matter, and a practical exercise |
| Role readiness | Strong evidence in this practice, developing evidence, or insufficient evidence, with an explanation |
| Possible next roles | Exploratory adjacent/stepping-stone roles and the knowledge or experience they could help build |
| Learning next steps | Relevant practice tasks or a saved learning plan |
| Assistance context | The user's disclosure and the limits of independent verification |

Feedback should quote or reference recorded responses accurately, distinguish missing evidence from lack of ability, and acknowledge uncertainty. A rubric item that never came up should be **not observed**, rather than failed.

### How to discuss being a strong candidate

Use wording such as: “Your decisions showed strong evidence of prioritization in this practice. Readiness for an HR Manager vacancy also depends on your actual experience, qualifications and that employer's requirements.”

Do not conclude that the user will or will not get a job from a single fictional exercise. To discuss actual candidacy, combine the practice evidence with the user's verified experience and a real job description, using the existing evidence-based job-fit workflow. Suggested alternative roles should be opportunities for development, not categorical statements that the user is unsuited to their target career. If there is insufficient background, ask before making those suggestions.

## Proposed implementation work, after approval

| Phase | Planned work | Completion criteria |
| --- | --- | --- |
| 1. Assessment customization | Add private built-in copies to the existing editor; preserve origin/version information | Users can add/reorder items, save and take a private copy without changing the original or earlier results |
| 2. Scenario setup | Add Scenarios within Explore Yourself; use saved job titles; explain handoff, independence and sensitivity preferences | Correct user's roles appear; empty states work; no session begins without the required setup |
| 3. Guided sessions | Add a role-scenario workflow skill and tools for start/read, staged updates, original responses, pause/resume and completion | A complete adaptive session can be resumed across chat/dashboard without mixing user accounts or duplicating steps |
| 4. Feedback and records | Add measured timing, evidence-linked feedback, readiness language and development suggestions | Reports reference real answers, show verification limits, and appear in the private dashboard |
| 5. Review and release | Run behavior, privacy, workflow and UI checks; review sensitive examples; publish the existing app/plugin only after implementation is authorized | Saved source, app tools and packaged skill instructions match; existing workflows still work |

Likely source areas:

- [`app/assessment-workspace.tsx`](../../app/assessment-workspace.tsx): built-in copy action and Scenarios entry.
- [`app/dashboard.tsx`](../../app/dashboard.tsx): profile/details navigation and access to saved reports.
- [`lib/career/assessment-templates.ts`](../../lib/career/assessment-templates.ts): template origin/version support.
- [`lib/career/tools.ts`](../../lib/career/tools.ts): validated, authenticated scenario operations.
- [`lib/career/store.ts`](../../lib/career/store.ts): new scenario record kind, with owner and revision checks.
- [`lib/career/workflows.ts`](../../lib/career/workflows.ts) and [`scripts/prepare-career-skills.mjs`](../../scripts/prepare-career-skills.mjs): scenario facilitation and packaged skill generation.
- New focused scenario UI and server modules, if useful; final filenames are to be decided during implementation.
- [`tests/career.mjs`](../../tests/career.mjs): meaningful state, privacy, timing and evidence tests.

Session records should retain the selected role and a snapshot of the scenario/rubric version, stage history, original responses, assistance declarations, timing events, feedback and revision. Treat generated case text and user responses as data, not trusted instructions. Keep records private to the authenticated account and include them in existing export/deletion workflows. Avoid destructive rewrites of completed attempts.

## Acceptance checklist for a future implementation

- [ ] Existing custom assessments still support adding items through the editor.
- [ ] A built-in can be copied privately, extended and completed without altering the shared questionnaire or past results.
- [ ] The scenario dropdown uses only the current user's saved roles and explains how to add missing titles.
- [ ] The user understands where the conversation runs and can start, pause, resume and complete it.
- [ ] ChatGPT asks one main question at a time, supports clarification and responds to the user's actual decisions.
- [ ] Sensitive cases require an informed choice and offer an alternative.
- [ ] Raw answers remain intact; no detector-based accusation or unverified AI-authorship claim is made.
- [ ] Timing comes from recorded events and does not silently penalize breaks or accessibility needs.
- [ ] Feedback supports its observations with actual responses and uses qualified readiness language.
- [ ] Alternative roles and learning steps are explained and grounded in the user's background.
- [ ] Cross-account reads/writes, stale edits, duplicate submissions and invalid session transitions are rejected.
- [ ] Scenario records can be exported and deleted through the existing account workflow.
- [ ] No payment, subscription, standalone hosting or public-access change is introduced in this batch.

## Future paid-feature designation and scope boundary

**Role scenarios: planned paid feature.** This is a roadmap designation only. It does not enable billing, subscriptions or a paywall. Existing assessment editing should remain available under its current access rules.

When commercialization is revisited, define which scenario capabilities are paid, preview access, quotas and a shared backend entitlement check. Review the then-current OpenAI plugin commerce rules before designing payment prompts or links. Do not introduce checkout or upgrade messaging as part of this proposal.

The following remain outside this batch: a standalone website, Stripe connection, pricing, subscriptions, employer-facing screening, guaranteed AI detection, a validated candidate ranking score, public launch, or automatic claims of hiring suitability.

## Decisions to review before coding

Suggested defaults are documented above, so these can be reviewed together rather than interrupting implementation repeatedly:

1. Approve private built-in copies as the normal customization path; treat shared-bank edits separately.
2. Approve ChatGPT-led scenarios for the first release, with dashboard setup and saved reports.
3. Approve a brief independent-practice agreement and assistance disclosure instead of a promised AI detector.
4. Approve practice-readiness feedback plus a separate actual-job-fit comparison when sufficient evidence exists.
5. Choose the initial example roles, stage count, difficulty options and approximate session length.
6. Confirm preview availability while scenarios remain designated for future paid access.

## References and basis

Current-code findings were checked against the repository's application source at planning time. The feasibility and product recommendations in this document are proposals, not released behavior.

- [Current editing guide](../EDITING_NEXTJOBBER.md)
- [Application output quality and provenance](../OUTPUT_QUALITY.md)
- [Liang et al., GPT detectors are biased against non-native English writers (2023)](https://arxiv.org/abs/2304.02819): primary research documenting detector bias and robustness limitations in the evaluated systems; not a benchmark of every current detector.
- [OpenAI, Our approach to EU text provenance rules (October 5, 2026)](https://openai.com/index/eu-text-provenance/): explains false positives/negatives and why a watermark does not measure human contribution.
- [EEOC, Small Business Fact Sheet: Harassment in the Workplace](https://www.eeoc.gov/small-business-fact-sheet-harassment-workplace): source material for an appropriate U.S. fictional workplace case.
- [EEOC, Checklists for Employers](https://www.eeoc.gov/checklists-employers-1): practice considerations, with the EEOC's explicit limit that the checklist does not establish legal compliance.
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines): review current requirements again before future paid distribution.
