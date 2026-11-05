# Content provenance

Source: https://github.com/Rudraksh2996/Portfolio at commit `be7ba0a246cf817bfadcbd7aaf73ece71a9cbe6d` (2026-11-05 retrieval). Repository cloned including history and all 46 tracked files. Reviewed README, app layout/page, content components, styles, animation/UI components, config, package metadata, assets, and resume text. UI boilerplate contains no additional portfolio facts. The original repo contains no project screenshots; starter logos are not personal imagery and are not reused.

| Content | Source |
| --- | --- |
| Name, role, email, GitHub, LinkedIn | `src/components/Hero.tsx` |
| Bio and Agentic AI interest | `src/components/About.tsx`; GitHub profile |
| Three projects, descriptions, tags, repository links | `src/components/Projects.tsx`; README |
| Skills | `src/components/TechStack.tsx` |
| Education, coursework, two certifications | `src/components/Certifications.tsx` |
| LeetCode and contact | `src/components/Contact.tsx`; README |
| Phone and location | README, confirmed by `public/resume.pdf` |

GitHub profile https://github.com/Rudraksh2996 was checked for pins. AuthenticationSystem is pinned and already represented. The portfolio's three documented projects remain the basis: eight chapters group GuardAuth (3), Expense Tracker (2), and Zru Studios (3). Chapter labels explicitly identify the repeated project; no eight-project claim is made.

## Editorial choices and missing information

- The source's Summer 2026 internship request is historical as of November 2026. No current availability or response-time promise is inferred. The contact invitation stays general.
- Employment history and testimonials are not supplied. Experience is explicitly marked “not provided.”
- Certification titles are reproduced as self-reported in the source; dates and credential links are marked not provided.
- Project screenshots and live demos are not supplied. Existing 3D crafts remain illustrative, with no claim that they depict the software.
- Education dates are 2024–2028. The bundled resume mentions KIET, while newer website/README copy removes it (commit `0b4f99e`); current site wording is followed and no institution is published here.
- Resume is copied unchanged from the source as a downloadable historical document. It still mentions Summer 2026 and KIET; the download is labelled “Source resume.”
- No testimonials, project usage statistics, commercial experience, or new certifications were invented.

All display data lives in `src/portfolio-data.json`. Build scripts escape text and derive content from that file; source URLs are public professional contact/project links supplied by the original portfolio.
