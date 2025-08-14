# Decentralized Project Funding Platform

A blockchain-based system where donors fund and review projects, and creators (students, innovators, teams) submit proposals and apply for funding.

## Key Features
- **Dashboards** for donors (fund/review) and creators (browse/apply/upload proof).
- **LLM-Powered Application Screening**: Automatically parses, validates, and scores proposals based on:
  - Novelty
  - Feasibility
  - Budget reasonableness
  - Applicant identity verification
- **Secure Backend (Node.js)** for authentication, API relay, and business logic.
- **MongoDB** for user profiles, project metadata, and applications.
- **Aptos Smart Contracts** for transparent, milestone-based disbursements.
- **Immutable Ledger** ensuring trust and accountability.

## Flow
1. **Creator**: Browse → Apply → LLM Validation → Shortlisting → Receive
2. **Donor**: Fund → Review (Post-LLM Shortlisting) → Approve → Disburse


