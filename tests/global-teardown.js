async function globalTeardown(config) {
  console.log("🧹 Starting global teardown...");

  // Clean up any temporary files or processes
  console.log("✅ Global teardown completed");
}

module.exports = globalTeardown;
