"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import styled, { createGlobalStyle, css } from "styled-components";

// 全局样式，移除默认的内外边距
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

// ==================== 主题配置 ====================
const theme = {
  primary: "#6366f1",
  secondary: "#4f46e5",
  bg: "#f8fafc",
  surface: "#ffffff",
  text: "#1e293b",
  accent: "#10b981",
};

// 社交媒体图标组件
const createIcon = (path: string) =>
  styled.svg.attrs({
    viewBox: "0 0 24 24",
    children: <path d={path} />,
  })`
  width: 24px;
  height: 24px;
  transition: all 0.2s;
`;

const TwitterIcon = createIcon(
  "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
);
const LinkedInIcon = createIcon(
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
);
const MediumIcon = createIcon(
  "M0 0v24h24V0H0zm19.938 5.686L18.651 6.92a.376.376 0 00-.143.362v9.067a.376.376 0 00.143.361l1.257 1.234v.271h-6.322v-.271l1.302-1.265c.128-.128.128-.165.128-.36V8.99l-3.62 9.195h-.488L6.69 8.99v6.163a.85.85 0 00.233.707l1.694 2.054v.27H3.815v-.27L5.51 15.86a.82.82 0 00.213-.707V8.027a.624.624 0 00-.203-.527L4.019 5.686v-.27h4.674l3.613 7.923 3.176-7.924h4.456v.271z"
);
const GitHubIcon = createIcon(
  "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
);

// 邮件订阅组件
const SubscribeSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    phone: "",
    wechat: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      alert("请填写必填字段（邮箱和消息内容）");
      return;
    }
    console.log("Form submitted:", formData);
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <EnvelopeContainer $isOpen={isOpen}>
      <EnvelopeIcon
        onClick={() => setIsOpen(!isOpen)}
        
        $isOpen={isOpen}
      >
        <svg viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      </EnvelopeIcon>

      <LetterPaper $isOpen={isOpen}>
        <FormTitle>请填写联系信息 ✍️</FormTitle>
        <SubscribeForm onSubmit={handleSubmit}>
          {/* 邮箱地址 */}
          <FormGroup>
            <Label>邮箱地址 <RequiredStar>*</RequiredStar></Label>
            <LetterInput
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {/* 可选信息行 */}
          <FormRow>
            <FormGroup>
              <Label>昵称</Label>
              <LetterInput
                type="text"
                name="nickname"
                placeholder="可选"
                value={formData.nickname}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>手机号</Label>
              <LetterInput
                type="tel"
                name="phone"
                placeholder="可选"
                pattern="[0-9]{11}"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>微信号</Label>
              <LetterInput
                type="text"
                name="wechat"
                placeholder="可选"
                value={formData.wechat}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>

          {/* 消息内容 */}
          <FormGroup>
            <Label>消息内容 <RequiredStar>*</RequiredStar></Label>
            <MessageTextarea
              name="message"
              placeholder="请输入您的留言..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <SendButton type="submit">
            立即发送
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </SendButton>
        </SubscribeForm>
      </LetterPaper>
    </EnvelopeContainer>
  );
};

// 功能互动层
const InteractiveLayer = styled.div`
  padding: 3rem 2rem;
`;

// 社交媒体矩阵组件
const SocialMediaSection = () => {
  const socialPlatforms = [
    { name: "GitHub", icon: GitHubIcon, url: "#" },
    { name: "Twitter", icon: TwitterIcon, url: "#" },
    { name: "LinkedIn", icon: LinkedInIcon, url: "#" },
    { name: "Medium", icon: MediumIcon, url: "#" },
  ];

  return (
    <SocialContainer>
      <h4>关注我们</h4>
      <SocialIcons>
        {socialPlatforms.map((platform) => (
          <SocialLink
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener"
          >
            <platform.icon />
          </SocialLink>
        ))}
      </SocialIcons>
    </SocialContainer>
  );
};

// 基础信息层组件
const BaseInfoLayer = () => {
  const links = [
    { text: "帮助中心", url: "#" },
    { text: "服务条款", url: "#" },
    { text: "隐私政策", url: "#" },
    { text: "合作伙伴", url: "#" },
  ];

  return (
    <BaseInfoContainer>
      <Copyright>
        © 2024 Your Company. All Rights Reserved.
        <ICP>沪ICP备12345678号</ICP>
      </Copyright>

      <FriendLinks>
        {links.map((link, index) => (
          <LinkItem key={index} href={link.url}>
            {link.text}
          </LinkItem>
        ))}
      </FriendLinks>

      <ContactEmail />
    </BaseInfoContainer>
  );
};

// 联系邮箱组件（带复制功能）
const ContactEmail = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("contact@example.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("复制邮箱地址失败:", error);
    }
  };

  return (
    <EmailContainer onClick={copyEmail}>
      <span>contact@example.com</span>
      {copied && <CopyTip>已复制到剪贴板</CopyTip>}
    </EmailContainer>
  );
};


const LazyUptimeDisplay = lazy(() => import("./UptimeDisplay"));

const Footer = () => {
  return (
    <>
      <GlobalStyle />
      <FooterContainer>
        {/* 功能互动层 */}
        <InteractiveLayer>
          <SubscribeSection />
          <SocialMediaSection />

          {/* 延迟加载统计组件 */}
          <Suspense fallback={<div>Loading stats...</div>}>
            <StatsContainer>
              <LazyUptimeDisplay />
            </StatsContainer>
          </Suspense>
        </InteractiveLayer>

        {/* 基础信息层 */}
        <BaseInfoLayer />
      </FooterContainer>
    </>
  );
};

// 样式组件
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

const FooterContainer = styled.footer`
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
  margin-top: auto;
  width: 100%;
  contain: layout;
`;

const EnvelopeContainer = styled.div<{ $isOpen: boolean }>`
  position: relative;
  min-height: 200px;
  margin: 2rem auto;
  max-width: 400px;
`;

const EnvelopeIcon = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  width: 120px;
  height: 120px;
  left: 50%;
  top: ${props => props.$isOpen ? '20%' : '50%'};
  transform: translate(-50%, -50%);
  color: ${theme.primary};

  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    transition: all 0.3s;
  }

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }

  ${props => props.$isOpen && `
    top: 20%;
    transform: translate(-50%, -50%) rotate(-10deg);
  `}
`;

const LetterPaper = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  width: 100%;
  background: linear-gradient(to bottom right, #fff9f0, #fff);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform-origin: top center;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'translateY(60px) scale(1)' : 'translateY(0) scale(0.8)'};

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #fff9f0;
  }

  h4 {
    color: ${theme.text};
    font-family: 'Ma Shan Zheng', cursive;
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
  }
`;

const FormTitle = styled.h4`
  color: ${theme.text};
  font-family: 'Ma Shan Zheng', cursive;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background: ${theme.primary};
    margin: 0.5rem auto;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${theme.text};
`;

const RequiredStar = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  height: 20px;
  padding: 0.8rem;
  border: none;
  border-bottom: 2px solid ${theme.primary};
  background: transparent;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-bottom-color: ${theme.secondary};
    box-shadow: 0 2px 0 ${theme.secondary};
  }

  &::placeholder {
    color: #94a3b8;
    font-style: italic;
  }
`;

const SubscribeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const LetterInput = styled.input`
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-bottom: 2px solid ${theme.primary};
  background: transparent;
  font-size: 0.95rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-bottom-color: ${theme.secondary};
    box-shadow: 0 2px 0 ${theme.secondary};
  }

  &::placeholder {
    color: #94a3b8;
    font-style: italic;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem auto 0;
  padding: 0.8rem 2.5rem;
  background: ${theme.primary};
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.2);

  svg {
    width: 18px;
    height: 18px;
    fill: white;
  }

  &:hover {
    background: ${theme.secondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
  }
`;

const SocialContainer = styled.div`
  flex: 1;
  padding-left: 2rem;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: ${theme.text};
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);

    svg {
      fill: ${theme.primary};
    }
  }
`;

const BaseInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-top: 1px solid #e2e8f0;
`;

const Copyright = styled.div`
  font-size: 0.875rem;
  color: ${theme.text};
`;

const ICP = styled.span`
  margin-left: 1rem;
  color: #64748b;
`;

const FriendLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const LinkItem = styled.a`
  color: ${theme.text};
  font-size: 0.875rem;
  text-decoration: none;

  &:hover {
    color: ${theme.primary};
  }
`;

const EmailContainer = styled.div`
  position: relative;
  font-size: 0.875rem;
  color: ${theme.text};
  cursor: pointer;

  &:hover {
    color: ${theme.primary};
  }
`;

const CopyTip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.text};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
`;

export default Footer;