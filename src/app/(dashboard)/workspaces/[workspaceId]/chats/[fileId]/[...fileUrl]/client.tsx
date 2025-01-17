'use client';

import { UpstashDict, UpstashMessage } from '@upstash/rag-chat';
import dynamic from 'next/dynamic';

import { useGetWorkspaceFile } from '@/common/api/files';
import ChatWrapper from '@/common/components/chat/ChatWrapper';
import { PageError, PageLoader } from '@/common/components/elements';
import { useFileId } from '@/common/hooks';
// import { getUserSubscriptionPlan } from '@/lib/stripe';

interface ChatClientProps {
  sessionId: string;
  initialMessages: UpstashMessage<UpstashDict>[];
}

const PdfRenderer = dynamic(
  () =>
    import('@/common/components/chat/PdfRenderer').then((mod) => mod.default),
  { ssr: false }
);

const ChatClient: React.FC<ChatClientProps> = ({
  sessionId,
  initialMessages,
}) => {
  const fileId = useFileId();
  const { data: file, isLoading } = useGetWorkspaceFile({
    fileId,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!file) {
    return <PageError message="未找到文档" />;
  }

  // const plan = await getUserSubscriptionPlan();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <div className="max-w-8xl mx-auto w-full grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={file.url} />
          </div>
        </div>
        <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          {/* <ChatWrapper isSubscribed={plan.isSubscribed} fileId={file.$id} /> */}
          <ChatWrapper
            sessionId={sessionId}
            initialMessages={initialMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatClient;
