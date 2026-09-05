import os
import re

sources_dir = os.path.join(os.path.dirname(__file__), "..", "lib", "sources")
files = ["hospitality-tourism.ts", "retail-logistics.ts", "community-care.ts", "business-creative.ts"]

all_ids = []
all_niches = {}

for f in files:
    path = os.path.join(sources_dir, f)
    with open(path, "r", encoding="utf-8") as file:
        content = file.read()
    
    # Extract IDs
    ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", content)
    niches = re.findall(r"nicheId:\s*['\"]([^'\"]+)['\"]", content)
    
    print(f"{f}: found {len(ids)} sources, {len(niches)} niche assignments")
    all_ids.extend(ids)
    
    for n in niches:
        all_niches[n] = all_niches.get(n, 0) + 1

print("\n--- Summary ---")
print(f"Total sources across all 4 files: {len(all_ids)}")
print(f"Unique source IDs: {len(set(all_ids))}")
if len(all_ids) != len(set(all_ids)):
    duplicates = [x for x in all_ids if all_ids.count(x) > 1]
    print(f"WARNING: Duplicates found: {set(duplicates)}")
else:
    print("SUCCESS: 100% unique IDs!")

print(f"Total distinct niches covered: {len(all_niches)}")
print("Niche breakdown:")
for niche, count in sorted(all_niches.items()):
    print(f"  - {niche}: {count}")
