import React from 'react';
import Navbar from 'src/components/layout/Navbar';
import Footer from 'src/components/layout/Footer';
import { Layout } from 'src/components/layout/Layout';
import { Helmet } from 'react-helmet';
import PageHeader from 'src/components/pageTitle/PageHeader';
import AssistantSidebar from 'src/components/assistant/AssistantSidebar';
import AssistantChatBox from 'src/components/assistant/AssistantChatBox';
import AssistantConversations from 'src/components/assistant/AssistantConversations';
import s from './style.module.less';

const AssistantView = () => {
  return (
    <>
      <Helmet title="Boclips Assistant" />
      <Layout rowsSetup="grid-rows-assistant-view" responsiveLayout>
        <Navbar />
        <PageHeader title="Boclips Assistant" description="" />
        <AssistantSidebar />
        <div className={s.chatbotContainer}>
          <AssistantChatBox />
          <AssistantConversations />
        </div>
        <Footer className="col-start-2 col-end-26" />
      </Layout>
    </>
  );
};

export default AssistantView;
