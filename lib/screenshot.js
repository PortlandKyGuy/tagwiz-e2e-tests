import fs from "fs-extra";
import path from "path";

export async function snap(page, testInfo, name) {
  const sanitizedTitle = testInfo.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const dir = path.join("artifacts", "screenshots", testInfo.project.name, sanitizedTitle);
  await fs.ensureDir(dir);
  const file = path.join(dir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  await testInfo.attach(`screenshot:${name}`, { path: file, contentType: "image/png" });
}
