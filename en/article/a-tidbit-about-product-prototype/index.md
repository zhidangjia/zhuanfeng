---
url: /en/article/a-tidbit-about-product-prototype/index.md
---
> Author: [Zhu Anfeng](https://zhuanfeng.netlify.app/)

When planning a product from 0 to 1—especially in government/enterprise domains—product managers often face a recurring problem: business data fields are unclear. In early iterations, designing a prototype frequently runs into this:

* the business is not mature, so nobody can define the data structure precisely
* engineering and data teams have not joined yet, so detailed data support is missing
* the UI needs realistic data, otherwise it looks empty

At this stage, PMs have to research and infer a reasonable set of fields. Otherwise the prototype becomes a shell: it fails to communicate requirements and may even impact decision-making.

💡 How can AI help?

AI can act as an intelligent data assistant and help PMs:

✅ infer likely fields based on comparable products and domain logic\
✅ quickly generate sample records so prototypes look real and discussions become easier\
✅ reference best practices to avoid missing critical fields

🎯 An example:

For a real requirement, I planned a module for "Smart City: Crowd Gathering Emergency Management" with:

1. pre-event, in-event, and post-event handling
2. for each function: feature description, interaction flow, data fields, inputs and outputs
3. for data fields: 10+ fields and 3 sample rows

👉 Below is what an AI produced. Different models (DeepSeek, ChatGPT, etc.) give similar answers, and they are at least a helpful starting point.

***

## Product Module: Smart City Crowd Gathering Emergency Management System

### 1. Pre-Event Warning (Risk Prediction and Prevention)

**Feature description**

* Combine historical data, real-time monitoring, and AI prediction models to assess crowd-gathering risk and warn early.
* Define crowd thresholds for different scenarios (concerts, malls, metro stations) and notify relevant departments in advance.

**Interaction**

* Admin users view traffic trends of hotspots and configure warning rules.
* Alerts are pushed to emergency management departments, merchants, and relevant managers via an app.

**Data fields**

1. **Location ID** (unique identifier)
2. **Location name** (mall, station, etc.)
3. **Real-time crowd count**
4. **Crowd growth rate** (per minute/hour)
5. **Max capacity** (safe upper bound)
6. **Weather**
7. **Historical crowd data** (similar time windows)
8. **Incident history**
9. **Safety level** (low/medium/high)
10. **Warning status** (normal/notice/warning)

**Sample data**

| Location ID | Location name | Real-time crowd count | Growth rate | Max capacity | Weather | Historical crowd data | Incident history | Safety level | Warning status |
|------|------|------|------|------|------|------|------|------|------|
| A001 | XX Mall | 1200 | +5% | 5000 | Sunny | 1100 | None | Low | Normal |
| A002 | XX Metro Station | 4500 | +8% | 6000 | Cloudy | 4000 | Congestion | Medium | Notice |
| A003 | XX Concert Venue | 9800 | +12% | 10000 | Rain | 9200 | Stampede | High | Warning |

***

### 2. In-Event Emergency Response

**Feature description**

* When anomalies occur, automatically trigger emergency response and dispatch resources.
* Provide best evacuation routes and coordinate with broadcast systems and command centers.

**Interaction**

* Show incident location, affected area, crowd density, etc.
* Provide AI-recommended actions such as evacuation routes and additional security staffing.

**Data fields**

1. **Incident ID**
2. **Incident type** (stampede, fire, violence, etc.)
3. **Time** (to the second)
4. **Location** (linked to Location ID)
5. **Affected crowd size** (estimated)
6. **Response level** (low/medium/high)
7. **Recommended actions**
8. **Dispatched resources** (responders, equipment, etc.)
9. **Live video feed**
10. **Status** (in progress/resolved)

**Sample data**

| Incident ID | Type | Time | Location | Affected crowd | Response level | Recommended actions | Resources | Live feed | Status |
|------|------|------|------|------|------|------|------|------|------|
| E001 | Stampede | 18:30:12 | A003 | 200 | High | Evacuate via south gate | 10 security staff | Live | In progress |
| E002 | Fire | 19:15:50 | A002 | 500 | High | Dispatch firefighters | 3 fire trucks | Live | In progress |
| E003 | Violence | 20:05:30 | A001 | 50 | Medium | Control individuals | 5 police officers | Live | Resolved |

***

### 3. Post-Event Review and Optimization

**Feature description**

* Record the full incident lifecycle, evaluate response effectiveness, and optimize emergency plans.
* Generate statistical reports for decision-makers.

**Interaction**

* Incident replay with key decision timestamps.
* Analytics modules to evaluate response efficiency.

**Data fields**

1. **Incident ID** (linked)
2. **Incident type** (linked)
3. **Response time** (from detection to handling)
4. **Actions taken** (final)
5. **Effectiveness** (effective/partly effective/ineffective)
6. **Casualties**
7. **Economic loss** (estimate)
8. **Optimization suggestions** (auto-analysis)
9. **Responsible unit**
10. **Review status** (not reviewed/reviewed)

**Sample data**

| Incident ID | Type | Response time | Actions taken | Effectiveness | Casualties | Economic loss | Suggestions | Responsible unit | Review status |
|------|------|------|------|------|------|------|------|------|------|
| E001 | Stampede | 5 min | Evacuate via south gate | Effective | 0 | 0 | Add more corridors | Security company | Reviewed |
| E002 | Fire | 8 min | Dispatch firefighters | Partly effective | 2 | 100k | Inspect wiring earlier | Fire brigade | Reviewed |
| E003 | Violence | 3 min | Control individuals | Effective | 0 | 0 | Increase patrols | Police | Reviewed |

***

### Summary

This smart-city emergency system covers **pre-warning, in-event response, and post-event review**. With data analysis, AI prediction, and real-time monitoring, it improves safety in crowd-gathering areas and makes emergency management more effective.

With a field list like this, product teammates can quickly build a fuller-looking prototype. It may be a rough start, but someone has to do 0-to-1 work, right?
