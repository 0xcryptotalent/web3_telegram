import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, usePublicClient } from "wagmi";
import Conversation from "~~/components/Conversation";
import { MetaHeader } from "~~/components/MetaHeader";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [, setIsLoading] = useState(true);

  const [channels, setChannel] = useState<any>([]);

  const { address: connectedAccount, isConnected } = useAccount();

  const { data: channelRegistryContract, isLoading: isLoadingConverslyRegistryContract } =
    useDeployedContractInfo("ChannelRegistry");
  const publicClient = usePublicClient();

  useEffect(() => {
    (async () => {
      if (!isConnected || isLoadingConverslyRegistryContract) return;

      setIsLoading(true);

      if (!channelRegistryContract?.address) return;
      if (!connectedAccount) return;

      const response = await publicClient.readContract({
        address: channelRegistryContract.address,
        abi: channelRegistryContract.abi,
        functionName: "getAllChannelInfo",
        args: [connectedAccount],
      });

      setChannel(response);
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingConverslyRegistryContract, isConnected]);

  return (
    <>
      <MetaHeader />
      <div className="ag-format-container">
        <div className="ag-courses_box">
          {channels.map((channel: any) => (
            <Conversation
              key={channel.channelAddress}
              address={channel.channelAddress}
              topic={channel.name}
              allowed={channel.allowed}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
