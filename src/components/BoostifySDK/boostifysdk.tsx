import { message } from "antd";
import { useState, useEffect } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
// import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import {  SyncOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { box, hash, box_keyPair, box_open, decodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-ts";
// import {
//   AptosWalletAdapterProvider,
//   NetworkName,
// } from "@aptos-labs/wallet-adapter-react";
// import { PetraWallet } from "petra-plugin-wallet-adapter";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";


interface Message {
  sender: string;
  timestamp: number;
  msg: string;
}

interface Friend {
  pubkey: string;
  name: string;
}

// interface BoxKeyPair {
//   publicKey: ByteArray; // Array with 32-byte public key
//   secretKey: ByteArray; // Array with 32-byte secret key
// }

function APTChat() {
  const [username, setUsername] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messageo, setMessage] = useState("");
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] = useState(false);
  const [isConnectModalVisible, setIsConnectModalVisible] = useState(true);
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const aptosConfig = new AptosConfig({ network: Network.DEVNET, faucet: "https://faucet.devnet.aptoslabs.com" });
  const aptos = new Aptos(aptosConfig);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  // const [eventListener, setEventListener] = useState<any>(null);
  const [friendKey, setFriendKey] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");
  const [isAccessCodeModalVisible, setIsAccessCodeModalVisible] = useState(false);



  useEffect(() => {
    if (connected) {
      setIsConnectModalVisible(false);
      checkUserResource();
    }
  }, [connected]);

  useEffect(() => {
    if (account) {
      fetchFriendList();
    }
  }, [account]);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages();
    }
  }, [selectedFriend]);

  useEffect(() => {
    // Retrieve local messages from local storage on component mount
    const storedLocalMessages = localStorage.getItem("localMessages");
    if (storedLocalMessages) {
      setLocalMessages(JSON.parse(storedLocalMessages));
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever local messages change
    localStorage.setItem("localMessages", JSON.stringify(localMessages));
  }, [localMessages]);

  // useEffect(() => {
  //   if (account) {
  //     const listener = aptos.event.getAccountEventsByEventType(
  //       `0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::NewMessageEvent`,
  //       handleNewMessageEvent
  //     );
  //     setEventListener(listener);
  //   }
  
  //   return () => {
  //     if (eventListener) {
  //       eventListener.unsubscribe();
  //     }
  //   };
  // }, [account]);

  const checkUserResource = async () => {
    if (!account) return;
    try {
      const resource = await aptos.account.getAccountResource({
        accountAddress: account.address.toString(),
        resourceType: "0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::User",
      });
      console.log(resource);

    } catch (error) {
    
        setIsCreateAccountModalVisible(true);
      
      console.error("Error checking user resource:", error);
    }
  };

  // const testEncryption = () => {
  //   // Generate sender's key pair
  //   const senderKeyPair = box_keyPair();
  //   const senderPublicKey = senderKeyPair.publicKey;
  //   const senderPrivateKey = senderKeyPair.secretKey;
  
  //   // Generate recipient's key pair
  //   const recipientKeyPair = box_keyPair();
  //   const recipientPublicKey = recipientKeyPair.publicKey;
  //   const recipientPrivateKey = recipientKeyPair.secretKey;
  
  //   // Message to be encrypted
  //   const message = "Hello, world!";
  
  //   // Generate nonce
  //   const timestamp = Date.now().toString();
  //   const nonceData = `${senderPublicKey}+${recipientPublicKey}+${timestamp}`;
  //   const nonce = hash(decodeUTF8(nonceData)).slice(0, 24);
  
  //   // Encrypt the message
  //   const encryptedMessage = box(
  //     new TextEncoder().encode(message),
  //     nonce,
  //     recipientPublicKey,
  //     senderPrivateKey
  //   );
  
  //   // Decrypt the message
  //   const decryptedMessage = box_open(
  //     encryptedMessage,
  //     nonce,
  //     senderPublicKey,
  //     recipientPrivateKey
  //   );
  
  //   // Log the results
  //   console.log("Sender's Public Key:", senderPublicKey);
  //   console.log("Sender's Private Key:", senderPrivateKey);
  //   console.log("Recipient's Public Key:", recipientPublicKey);
  //   console.log("Recipient's Private Key:", recipientPrivateKey);
  //   console.log("Original Message:", message);
  //   console.log("Encrypted Message:", encryptedMessage);
  //   console.log("Decrypted Message:", new TextDecoder().decode(decryptedMessage) ? new TextDecoder().decode(decryptedMessage) : "Decryption failed");
  // };


  const handleCreateAccount = async () => {
    if (!account) return;
  
    try {
      const keyPair = box_keyPair();
      const publicKey = encodeBase64(keyPair.publicKey);
      const privateKey = encodeBase64(keyPair.secretKey);
  
      // Store the private key securely (e.g., in local storage or a secure storage mechanism)
      localStorage.setItem("privateKey", privateKey);
  
      const transaction: InputTransactionData = {
        data: {
          typeArguments: [],
          function: "0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::create_account",
          functionArguments: [username, publicKey],
        },
      };
  
      const response = await signAndSubmitTransaction(transaction);
      console.log(response);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      message.success("Account created successfully");
      setIsCreateAccountModalVisible(false);
      fetchFriendList();
      setIsAccessCodeModalVisible(true);
    } catch (error) {
      console.error(error);
      message.error("You are not Whitelisted Yet, Contact Admin");
    }
  };

  const handleAddFriend = async (friendKey: string) => {
    if (!account) return;
    try {
      const transaction: InputTransactionData = {
        data: {
          typeArguments: [],
          function: "0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::add_friend",
          functionArguments: [friendKey, username],
        },
      };
      const response = await signAndSubmitTransaction(transaction);
      console.log(response);
      await aptos.waitForTransaction({ transactionHash: response.hash });
      await fetchFriendList();
      message.success("Friend added successfully");
      setFriendKey(""); // Clear the input field after adding a friend
      setIsAddFriendModalVisible(false); // Close the modal after adding a friend
    } catch (error) {
      console.error(error);
      message.error("Failed to add friend | Person has Not Registered Contact Admin");
    }
  };
  // const handleNewMessageEvent = async (event: any) => {
  //   const newMessage = event.data.message;
  //   const decodedMessage = {
  //     sender: newMessage.sender,
  //     timestamp: newMessage.timestamp,
  //     msg: new TextDecoder().decode(decodeBase64(newMessage.msg)),
  //   };
  //   setMessages((prevMessages) => [...prevMessages, decodedMessage]);
  // };
  const handleSendMessage = async () => {
    if (!account || !selectedFriend) return;
    try {
      const userResource = await aptos.account.getAccountResource({
        accountAddress: selectedFriend.pubkey,
        resourceType: "0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::User",
      });
      if (userResource) {
        const selectedFriendPublicKey = decodeBase64(userResource.public_key);
        const privateKey = decodeBase64(localStorage.getItem("privateKey") || "");
        const timestamp = Date.now().toString();
        const nonceData = `${account.address.toString()}_${selectedFriend.pubkey}_${timestamp}`;
        const nonce = hash(decodeUTF8(nonceData)).slice(0, 24);
        const encryptedMessage = box(
          decodeUTF8(messageo),
          nonce,
          selectedFriendPublicKey,
          privateKey
        );
        const transaction: InputTransactionData = {
          data: {
            typeArguments: [],
            function: "0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::send_message",
            functionArguments: [selectedFriend.pubkey, encodeBase64(encryptedMessage), timestamp],
          },
        };
        const response = await signAndSubmitTransaction(transaction);
        if (response) {
          console.log(response);
          await aptos.waitForTransaction({ transactionHash: response.hash });
          setMessage("");
          // Store the sent message locally
          const sentMessage: Message = {
            sender: account.address.toString(),
            timestamp: parseInt(timestamp),
            msg: messageo,
          };
          setLocalMessages((prevMessages) => [...prevMessages, sentMessage]);
        } else {
          message.error("Failed to send message");
        }
      } else {
        console.log(userResource);
        message.error("User resource not found or missing data");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to send message");
    }
  };

  const fetchMessages = async () => {
    if (!account || !selectedFriend) return;
    try {
      const userResource = await aptos.account.getAccountResource({
        accountAddress: selectedFriend.pubkey,
        resourceType: "0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::User",
      });
      if (userResource) {
        const selectedFriendPublicKey = decodeBase64(userResource.public_key);
        const chatMessagesResource = await aptos.account.getAccountResource({
          accountAddress: account.address.toString(),
          resourceType: "0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::ChatMessages",
        });
        if (chatMessagesResource) {
          const chats = chatMessagesResource.chats;
          const selectedChat = chats.find((chat: any) =>
            chat.participants.includes(selectedFriend.pubkey)
          );
          if (selectedChat) {
            const privateKey = decodeBase64(localStorage.getItem("privateKey") || "");
            const publicKey = selectedFriendPublicKey;
            const decryptedMessages = selectedChat.messages.map((message: any) => {
              const nonceData = `${message.sender}_${account.address.toString()}_${message.timestamp}`;
              const nonce = hash(decodeUTF8(nonceData)).slice(0, 24);
              const decryptedMsg = box_open(
                decodeBase64(message.msg),
                nonce,
                publicKey,
                privateKey
              );
              return {
                sender: message.sender,
                timestamp: message.timestamp,
                msg: decryptedMsg ? new TextDecoder().decode(decryptedMsg) : "",
              };
            });
            setMessages(decryptedMessages);
          } else {
            setMessages([]);
          }
        } else {
          console.log(chatMessagesResource);
          message.error("ChatMessages resource not found or missing data");
        }
      } else {
        console.log(userResource);
        message.error("User resource not found or missing data");
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      message.error("Failed to fetch chat messages");
    }
  };
  const fetchFriendList = async () => {
    if (!account) return;
    try {
      const resource = await aptos.account.getAccountResource({
        accountAddress: account.address.toString(),
        resourceType: "0x83af638081fc385750856d3db2bf47034243091869e6bce1ced66644e0ac97f4::aptchat10::User",
      });
      if (resource) {
        const friendList = resource.friend_list.map((friend: any) => ({
          pubkey: friend.pubkey,
          name: friend.name,
        }));
        setFriendList(friendList);
      } else {
        console.log(resource);
        message.error("User resource not found or missing data");
      }
    } catch (error) {
      console.error("Error fetching friend list:", error);
      message.error("Failed to fetch friend list");
    }
  };


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString();
  };

  const handleRefreshMessages = async () => {
    await fetchMessages();
  };

  return (
<div className="flex flex-col h-screen antialiased text-gray-200 bg-gradient-to-br from-gray-900 to-black">
  <div className="flex flex-row flex-1 overflow-hidden">
    {/* Sidebar */}
<div className="flex flex-col w-64 bg-gradient-to-b rounded-2xl m-4 from-gray-800 to-gray-900 p-4 shadow-lg">
  <div className="flex flex-col flex-1">
    <div className="flex flex-col items-center bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 rounded-lg p-4 mb-4 shadow-md">
      <div className="h-20 w-20 rounded-full border overflow-hidden">
        {/* User Avatar */}
        <img src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=826&t=st=1713025393~exp=1713025993~hmac=122ac422ad8ee792b454e35349707ce353afccf12457b9f95a61ec070aeddaf0" alt="User Avatar" />
      </div>
      {/* <div className="text-sm font-semibold mt-2 text-white text-trucate text-nowrap text-clip ">{account?.address?.toString()}</div> */}
      <div className="text-xs text-gray-400">Aptos Account</div>
      {/* <div className="flex items-center mt-3">
        <div className="flex justify-center h-4 w-8 bg-gray-500 rounded-full">
          <div className="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
        </div>
        <div className="leading-none ml-1 text-xs text-gray-400">Active</div>
      </div> */}
    </div>
    <div className="flex flex-col mt-4 flex-1">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-bold text-gray-400">Active Conversations</span>
        <span className="flex items-center justify-center bg-gray-600 text-gray-400 h-4 w-4 rounded-full">
          {friendList.length}
        </span>
      </div>
      <div className="flex flex-col space-y-1 overflow-y-auto flex-1">
        {friendList.map((friend) => (
          <button
            key={friend.pubkey}
            onClick={() => setSelectedFriend(friend)}
            className="flex items-center hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 rounded-lg p-2 shadow-md"
          >
            <div className="flex items-center justify-center h-8 w-8 bg-gray-600 rounded-full">
              {/* Friend Avatar */}
            </div>
            <div className="ml-2 text-sm font-semibold text-white">{friend.name}</div>
          </button>
        ))}
      </div>
    </div>
  </div>
  <div className="mt-4">
    <WalletConnector />
  </div>
</div>
    {/* Chat Area */}
    <div className="flex flex-col rounded-2xl m-4 flex-1">
      {/* Chat Header */}
      <div className="flex items-center rounded-2xl justify-between px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
        <div className="flex items-center">
          <div className="flex items-center justify-center rounded-full bg-gray-700 h-10 w-10 mr-4">
            <img src="/aptos.png" alt="Logo" />
          </div>
          <div className="text-2xl font-semibold text-white">
            {selectedFriend ? selectedFriend.name : "Select a friend to start chatting"}         <div className="text-sm font-semibold mt-2 text-white text-trucate text-nowrap text-clip ">{account?.address?.toString()}</div>

          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            className="px-4 py-2 mr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Search"
          />
          <div className="flex items-center">
              <button
      className="flex items-center justify-center h-10 w-30 ml-4 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      onClick={handleRefreshMessages}
    >
            <SyncOutlined className="m-2"/> <div className="mr-2">Refresh</div>
    </button>

          <button
            className="flex items-center justify-center h-10 w-30 ml-4 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={() => setIsAddFriendModalVisible(true)}
          >
            <PlusCircleOutlined className="m-2"/> <div className="mr-2">Add Friend</div>
          </button>

          <button
            className="flex items-center justify-center h-10 w-30 ml-4 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={() => setIsAccessCodeModalVisible(true)}
          >
            <PlusCircleOutlined className="m-2"/> <div className="mr-2">Victors Code</div>
          </button>
          </div>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex flex-col flex-1 overflow-y-auto p-6">
        {selectedFriend ? (
          <div className="flex flex-col">
            {[...messages, ...localMessages].map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === account?.address?.toString()
                    ? "justify-end"
                    : "justify-start"
                } mb-4`}
              >
                <div
                  className={`relative max-w-xl px-4 py-2 text-gray-200 rounded-lg shadow ${
                    msg.sender === account?.address?.toString()
                      ? "bg-gradient-to-r from-gray-600 to-gray-700 rounded-br-none"
                      : "bg-gradient-to-r from-gray-500 to-gray-600 rounded-bl-none"
                  }`}
                >
                  <span className="block">{msg.msg}</span>
                  <span className="block text-xs text-gray-400 mt-1">
                    {formatTimestamp(msg.timestamp.toString())}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-3xl font-semibold text-gray-500">
              Select a friend to start chatting
            </span>
          </div>
        )}
      </div>

      {isAccessCodeModalVisible && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 z-10 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Access Code</h3>
      <p className="text-gray-400 mb-4">
        Your access code is: <span className="font-bold">{import.meta.env.VITE_ACCESS_CODE}</span>
      </p>
      <div className="flex justify-end">
        <button
          onClick={() => setIsAccessCodeModalVisible(false)}
          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      {/* Send Message */}
      {selectedFriend && (
        <div className="flex items-center bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-2 shadow-md">
          <div>
            <button className="flex items-center justify-center text-gray-500 hover:text-gray-600">
              {/* Attach Button */}
            </button>
          </div>
          <div className="flex-1 ml-4">
            <div className="relative">
              <input
                type="text"
                value={messageo}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 pl-4 pr-12 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md"
                placeholder="Type your message"
              />
              <button className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-12 text-gray-500 hover:text-gray-600">
                {/* Emoji Button */}
              </button>
            </div>
          </div>
          <div className="ml-4">
            <button
              onClick={handleSendMessage}
              disabled={!connected || !selectedFriend || !messageo}
              className="flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg text-white px-4 py-2 shadow-md"
            >
              <span>Send</span>
              <span className="ml-2">
                {/* Send Icon */}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  {/* Create Account Modal */}
  {isCreateAccountModalVisible && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 z-10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Create Account</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4 shadow-md"
          placeholder="Enter your username"
        />
        <div className="flex justify-end">
          <button
            onClick={handleCreateAccount}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2 shadow-md"
          >
            Create
          </button>
          <button
            onClick={() => setIsCreateAccountModalVisible(false)}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
  {/* Connect Wallet Modal */}
  {isConnectModalVisible && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 z-10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Connect Wallet</h3>
        <p className="text-gray-400 mb-4">Please connect your wallet to use Aptos Chat.</p>
        <WalletConnector />
      </div>
    </div>
  )}
  {/* Add Friend Modal */}
  {isAddFriendModalVisible && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 z-10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Add Friend</h3>
        <input
          type="text"
          value={friendKey}
          onChange={(e) => setFriendKey(e.target.value)}
          className="w-full px-3 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4 shadow-md"
          placeholder="Enter friend's public address"
        />
        <div className="flex justify-end">
          <button
            onClick={() => handleAddFriend(friendKey)}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2 shadow-md"
          >
            Add
          </button>
          <button
            onClick={() => setIsAddFriendModalVisible(false)}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}

export default APTChat;