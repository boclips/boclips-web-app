import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import AssistantSidebar from 'src/components/assistant/AssistantSidebar';
import AssistantChatBox from 'src/components/assistant/AssistantChatBox';
import AssistantConversations from 'src/components/assistant/conversations/AssistantConversations';
import { AssistantContextProvider } from 'src/components/assistant/context/assistantContextProvider';

const AssistantView = () => {
  return (
    <>
      <Helmet title="Boclips Assistant" />
      <Layout rowsSetup="grid-rows-assistant-view" responsiveLayout>
        <Navbar />
        <AssistantContextProvider>
          <AssistantSidebar />
          <AssistantChatBox />
          <AssistantConversations />
        </AssistantContextProvider>
        <Footer className="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default AssistantView;
