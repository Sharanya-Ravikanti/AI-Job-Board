import json
import os
import re
##from urllib import response
import requests
from dotenv import load_dotenv

from utils.platform_rules import PLATFORM_RULES

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = "openrouter/free"


def _call_openrouter(prompt):
    if not API_KEY:
        return None

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "AI Job Board",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are an expert HR recruiter. "
                            "Always produce professional business English. "
                            "Never use any language except English. "
                            "Never output markdown tables. "
                            "Never output HTML. "
                            "Never output malformed Unicode. "
                            "Use headings and bullet points only."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
            },
            timeout=30,
        )

        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text)

        if response.status_code == 200:
            data = response.json()
            print("MODEL RESPONSE:", data)
            return data["choices"][0]["message"]["content"]

        print("OpenRouter Error:", response.text)

    except Exception as e:
        print("AI Error:", e)

    return None

def generate_job_description(title, skills, experience):
    prompt = f"""
Generate a professional job description.

Job Title: {title}
Skills: {skills}
Experience: {experience}

Return the job description in Markdown format.

Format exactly like this:

# Job Description

## Company Introduction
- Point 1
- Point 2
- Point 3

## Job Summary
A concise paragraph describing the role.

## Responsibilities
- Responsibility 1
- Responsibility 2
- Responsibility 3

## Required Skills
- Skill 1
- Skill 2
- Skill 3

## Preferred Qualifications
- Qualification 1
- Qualification 2

## Benefits
- Benefit 1
- Benefit 2

Rules:
- Professional English only.
- Keep it ATS friendly.
- Do not use tables.
- Do not use HTML.
- Return ONLY the job description.
"""

    ai_response = _call_openrouter(prompt)
    print("\n===== GENERATED JD FROM AI =====")
    print(ai_response)
    print("================================\n")
    if ai_response:
        return ai_response

    return f"""
    # Job Description

    ## Company Introduction

    We are a fast-growing technology company looking for talented professionals.

    ## Job Summary

    We are hiring a **{title}** with **{experience}** of experience.

    ## Responsibilities

    - Develop scalable applications
    - Collaborate with cross-functional teams
    - Write clean and maintainable code
    - Participate in code reviews

    ## Required Skills

    - {skills}

    ## Preferred Qualifications

    - Strong communication skills
    - Problem-solving mindset
    - Experience with Agile

    ## Benefits

    - Competitive salary
    - Flexible work environment
    - Learning and growth opportunities
"""


def optimize_job_description(description, platform):
    platform_name = (platform or "").strip().lower()
    platform_rules = PLATFORM_RULES.get(platform_name, PLATFORM_RULES["linkedin"])
    criteria = platform_rules.get("criteria", [])
    criteria_text = "\n".join(f"- {criterion}" for criterion in criteria)

    prompt = f"""
Rewrite the following job description for {platform_name} so it satisfies this platform checklist:

{criteria_text}

Requirements:
- Preserve the original role.
- Improve clarity and readability.
- Use professional English.
- Use headings and bullet points only.
- Keep it ATS-friendly.
- Do not use HTML.
- Do not use markdown tables.
Return ONLY Markdown.

Do not include any explanation.

Do not include phrases like:
"Here is the optimized job description."

Return ONLY the final job description.
Use the following structure:

## Company Introduction

## Job Summary

## Responsibilities

## Required Skills

## Preferred Qualifications

## Benefits

Use bullet points wherever appropriate.

Return ONLY Markdown.

{description}
"""

    ai_response = _call_openrouter(prompt)
    print("\n===== OPTIMIZED JD FROM AI =====")
    print(ai_response)
    print("================================\n")
    if ai_response:
        return ai_response.strip()

    fallback_lines = [
        "Job Overview",
        f"- {description.strip() or 'This opportunity is designed for a qualified professional.'}",
        "",
        "Key Requirements",
    ]
    for criterion in criteria[:6]:
        fallback_lines.append(f"- {criterion}")

    return "\n".join(fallback_lines).strip()


def _parse_json_response(raw_response):
    if not raw_response:
        return None

    text = raw_response.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        text = text[start : end + 1]

    try:
        return json.loads(text)
    except Exception:
        return None

def validate_job_description(description, platform):
    platform_name = (platform or "").strip().lower()
    platform_rules = PLATFORM_RULES.get(platform_name, PLATFORM_RULES["linkedin"])
    criteria = platform_rules.get("criteria", [])
    criteria_text = "\n".join(f"- {criterion}" for criterion in criteria)
    prompt = f"""
    You are an expert HR recruiter.

    Evaluate the following job description for the platform: {platform_name}.

    Return ONLY valid JSON.

    Rules:
    - Do NOT return markdown.
    - Do NOT use code fences.
    - Do NOT write any explanation outside the JSON.
    - Every checklist item MUST appear exactly once.
    - Do NOT skip any checklist item.
    - Every "reason" must be specific to that criterion.
    - Do NOT repeat the same reason for multiple criteria.

    Allowed status values:
    - good
    - needs_improvement
    - missing

    Return JSON in exactly this format:

    {{
        "criteria": [
        {{
            "name": "Responsibilities",
            "status": "good",
            "reason": "Responsibilities are clearly defined using action-oriented bullet points."
        }},
        {{
            "name": "Benefits",
            "status": "missing",
            "reason": "Employee benefits are not mentioned."
        }}
        ]
    }}

Checklist:
{criteria_text}

Job Description:
{description}
"""
    



    ai_response = _call_openrouter(prompt)
    print("\n========== RAW AI RESPONSE ==========")
    print(ai_response)
    print("=====================================\n")
    parsed = _parse_json_response(ai_response)

    normalized = []

    # Parse AI response
    if (
        parsed
        and isinstance(parsed, dict)
        and isinstance(parsed.get("criteria"), list)
    ):
        for item in parsed["criteria"]:
            if not isinstance(item, dict):
                continue

            name = str(item.get("name", "")).strip()
            status = str(item.get("status", "")).strip().lower()
            reason = str(item.get("reason", "")).strip()

            if status not in {"good", "needs_improvement", "missing"}:
                status = "needs_improvement"

            if name:
                normalized.append({
                    "name": name,
                    "status": status,
                    "reason": reason or "No explanation provided."
                })

    # If AI completely fails
    if not normalized:

        recommendation_map = {
            "Clear and searchable job title":
                "Use a clear, concise, and searchable job title.",

            "Compelling opening summary":
                "Add a compelling summary describing the role and its impact.",

            "Responsibilities":
                "Include clear day-to-day responsibilities using bullet points.",

            "Required skills":
                "Specify the technical and soft skills required for the position.",

            "Qualifications":
                "Mention the required education, certifications, or experience.",

            "Benefits":
                "Highlight salary, benefits, perks, or company culture."
    }

        for criterion in criteria:

            normalized.append({
                "name": criterion,
                "status": "needs_improvement",
                "reason": recommendation_map.get(
                    criterion,
                    f"Improve the section related to '{criterion}'."
                )
        })

    # Ensure every checklist item exists
    existing = {item["name"] for item in normalized}

    for criterion in criteria:
        if criterion not in existing:
            normalized.append({
                "name": criterion,
                "status": "missing",
                "reason": "This criterion was not evaluated by the AI."
            })

    # Sort according to original checklist order
    order = {name: index for index, name in enumerate(criteria)}
    normalized.sort(key=lambda x: order.get(x["name"], 999))

    # Backend score calculation
    points = {
        "good": 10,
        "needs_improvement": 5,
        "missing": 0,
    }

    earned_points = sum(points[item["status"]] for item in normalized)
    maximum_points = len(criteria) * 10

    score = (
        round((earned_points / maximum_points) * 100)
        if maximum_points
        else 0
    )

    strengths = [
    f"{item['name']} — {item['reason']}"
    for item in normalized
    if item["status"] == "good"
]

    missing = [
        item["name"]
        for item in normalized
        if item["status"] == "missing"
    ]

    recommendations = list(dict.fromkeys([
    item["reason"]
    for item in normalized
    if item["status"] != "good"
]))

    return {
        "score": score,
        "criteria": normalized,
        "strengths": strengths,
        "missing": missing,
        "recommendations": recommendations,
    }
