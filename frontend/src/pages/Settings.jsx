import Layout from "../layout/Layout";
import PageLayout from "../layout/PageLayout";
import Card from "../components/ui/Card";

export default function Settings() {
  return (
    <Layout>
      <PageLayout
        title="Settings"
        subtitle="Customize your Finance Copilot"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Profile */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">
              👤 Profile
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Application</span>
                <span className="font-medium">
                  AI Finance Copilot
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Mode</span>
                <span className="font-medium text-green-500">
                  MVP
                </span>
              </div>
            </div>
          </Card>

          {/* Currency */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">
              💰 Currency
            </h2>

            <select
              defaultValue="INR"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-transparent"
            >
              <option value="INR">Indian Rupee (₹)</option>
            </select>

            <p className="text-xs text-gray-500 mt-3">
              Multi-currency support will be available in a future version.
            </p>
          </Card>

          {/* AI */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">
              🤖 AI Advisor
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">Provider</span>
                <span>Google Gemini</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Current Model</span>
                <span>Gemini Flash</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-green-500">
                  Connected
                </span>
              </div>

            </div>
          </Card>

          {/* About */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">
              📦 About
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span>v1.0 MVP</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Frontend</span>
                <span>React + Vite</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Backend</span>
                <span>FastAPI</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Database</span>
                <span>PostgreSQL</span>
              </div>

            </div>
          </Card>

          {/* Upcoming */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">
              🚀 Coming Soon
            </h2>

            <ul className="space-y-2 text-sm text-gray-500 list-disc pl-5">
              <li>Multi-currency support</li>
              <li>Bank account integration</li>
              <li>Investment tracking</li>
              <li>Recurring expense detection</li>
              <li>Advanced AI financial planning</li>
            </ul>
          </Card>

        </div>
      </PageLayout>
    </Layout>
  );
}