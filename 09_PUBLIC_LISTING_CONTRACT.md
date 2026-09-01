# Public listing contract

Status: active product direction, 1 September 2026

## Two inventory streams

1. **Employer-posted listing** — supplied directly through the employer form. The employer chooses an application email or external application link. Contact ownership and business identity must be verified before publication.
2. **Sourced listing** — found on an approved employer or institutional source. Candidates apply at the original source. Every displayed fact requires retained evidence; missing information remains `Not stated`.

Both streams use the same job facts and expiry rules. They use different labels, application treatment and provenance records.

## What every job page must answer

- What is the work?
- Who is hiring?
- Where is the workplace?
- What is the employment form?
- How many hours are expected, and per week, month or shift?
- Which days and time windows are involved?
- When does the work start and, if fixed-term, end?
- How much is paid?
- Is that amount per hour, shift, day, week, month, year or project?
- Is the amount gross or net?
- When is it paid: after the shift, weekly, every two weeks or monthly?
- Are tips, bonuses, meals or other extras stated?
- Which languages, experience or certificates are required?
- How and by when does the candidate apply?

## Compensation rule

`rate_interval` and `payout_cadence` are different fields.

Example: `EUR 15 gross per hour`, paid `monthly`.

Do not convert hourly pay into monthly pay or infer payout timing. Display `Not stated` when a source does not provide the fact. Store ranges as numeric minimum and maximum amounts plus the original evidence text.

## Publication rule

An employer-posted job cannot publish until its employer and application destination are verified. A sourced job cannot publish without a live original application destination. Payment, when later introduced, must never override either gate.
