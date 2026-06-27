import { useState } from "react";
import ReceiptUpload from "../components/ReceiptUpload";
import ReceiptCard from "../components/ReceiptCard";
export default function Dashboard() {

  const [receipt, setReceipt] = useState(null);

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        AI Finance Copilot 💰
      </h1>

      <ReceiptUpload onSuccess={setReceipt} />

      {receipt && <ReceiptCard receipt={receipt.ai_result} />}

    </div>
  );
}