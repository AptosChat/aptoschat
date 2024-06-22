import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { Layout} from "antd";
import APTChat from "./components/BoostifySDK/boostifysdk";
import VideoCalling from "./components/BoostifySDK/videochat";
import { Room } from "./components/BoostifySDK/room";
// Room

// const { TextArea } = Input;

function App() {
 

  return (
    <Layout>
      {/* <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
           APTChat
        </Title>
 
      </Header> */}
      {/* <Content style={{ padding: "24px" }}>
        <Title level={2}>Random Move Module</Title> */}
        {/* <TextArea
          rows={8}
          value={moduleCode}
          onChange={(e) => setModuleCode(e.target.value)}
          placeholder="Enter your move module code here"
          style={{ marginBottom: "16px" }}
        /> */}
        {/* <Button type="primary" style={ { marginBottom: "16px", marginRight: "16px" } } onClick={handleDeploy}>
          Call Random
        </Button>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add
        </Button>
      </Content> */}
    <div className="min-h-screen  text-white">
      {/* <VideoCalling /> */}
      <Room/>
    </div>
      {/* <Modal
        title="Sign Transaction"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="sign" type="primary" onClick={handleSignTransaction}>
            Sign Transaction
          </Button>,
          <Button key="connect" type="primary" onClick={handleConnectWallet}>
            Connect Wallet
          </Button>,
        ]}
      >
        <p>Please sign the transaction to deploy the move module.</p>
      </Modal> */}
    </Layout>
  );
}

export default App;