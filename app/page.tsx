
import Layout from "../components/Layout";
import Account from "./account/page";
export default function Home() {

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <Account/>
      </div>
    </Layout>
  );
}
