import { useEffect, useState } from "react";
import { getLiveMessage } from "../api/collectionService";

export const useLiveMessage = () => {
  const [storeReadCount, setStoreReadCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { messageLive } = await chrome.storage.local.get(["messageLive"]);
      const fetchLiveMessage = await getLiveMessage();
  
      if (messageLive?.message !== fetchLiveMessage.message) {
        await chrome.storage.local.set({ messageLive: fetchLiveMessage });
        await chrome.storage.local.remove("readCount");
        console.log("This ran once");
      }
      const { readCount } = await chrome.storage.local.get(["readCount"]);
      if (readCount !== undefined) {
          setStoreReadCount(readCount);
      } else {
          setStoreReadCount(3);
          await chrome.storage.local.set({ readCount: 3 });
      }
    };
  
    fetchData();
  
    const decreaseReadCount = async () => {
      await chrome.storage.local.get(["readCount"], async ({ readCount }) => {
        if (readCount && readCount > 0) {
          const updatedReadCount = readCount - 1;
          setStoreReadCount(updatedReadCount);
          await chrome.storage.local.set({ readCount: updatedReadCount });
        }
      });
    };
  
    return decreaseReadCount;
  }, []);

  return { storeReadCount };
};
