// import { useState } from "react";
// import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
// import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Layout } from "antd";
// import { Content } from "antd/es/layout/layout";
import BoostifySDK from "./components/BoostifySDK/boostifysdk";

// const { Header } = Layout;
// const { Title } = Typography;
// const { TextArea } = Input;

function App() {
  // const aptosConfig = new AptosConfig({ network: Network.RANDOMNET, faucet: "https://faucet.random.aptoslabs.com" });
  // const aptos = new Aptos(aptosConfig); // default to devnet
  // const { signAndSubmitTransaction } = useWallet();

  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const handleSignTransaction = async () => {
  //   try {
  //     const response = await signAndSubmitTransaction({
  //       type_arguments: [],
  //       function: "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b::RandomnessInt::generate_random_u64",
  //       type: "entry_function_payload",
  //       arguments: [],
  //     });
  //     console.log(response);
  //     await aptos.waitForTransaction({ transactionHash: response.hash });
  //     message.success("Move module deployed successfully!");
  //     setIsModalVisible(false);
  //   } catch (error) {
  //     console.error(error);
  //     message.error("Failed to deploy move module.");
  //   }
  // };

  // const handleConnectWallet = async () => {
  //   try {
  //     // await connect();
  //     message.success("Wallet connected successfully!");
  //     setIsModalVisible(false);
  //   } catch (error) {
  //     console.error(error);
  //     message.error("Failed to connect wallet.");
  //   }
  // };
  // const handleDeploy = async () => {
  //   if (!connected || !account) {
  //     message.error("Please connect your wallet first.");
  //     return;
  //   }

  //   const accountAddress = account.address;
  //   const check = await aptos.account.getAccountAPTAmount({ accountAddress });
  //   console.log(check);

  //   const onSignAndSubmitTransaction = async () => {
  //     try {
  //       const response = await signAndSubmitTransaction({
  //         type_arguments: [],
  //         function: "0x6e696592f0d65b63accb62b34881e785fe2e2a5bc8c60204d98623f26384e99b::RandomnessInt::generate_random_u64",
  //         type: "entry_function_payload",
  //         arguments: [],
  //       });
  //       console.log(response);
  //       await aptos.waitForTransaction({ transactionHash: response.hash });
  //       message.success("Random module Called successfully!");
  //     } catch (error) {
  //       console.error(error);
  //       message.error("Failed to deploy move module.");
  //     }
  //   };

  //   await onSignAndSubmitTransaction();
  // };

  return (
    <Layout>
      {/* <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Aptos Chat
        </Title>
        <WalletSelector />
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
        <BoostifySDK />
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