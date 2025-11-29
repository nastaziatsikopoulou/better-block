import { useState } from 'react';
import { MapView } from './components/MapView';
import { ReportIssue } from './components/ReportIssue';
import { Profile } from './components/Profile';
import { RewardsMarketplace } from './components/RewardsMarketplace';
import { CommunityChat } from './components/CommunityChat';
import { AIHelper } from './components/AIHelper';
import { LoginScreen } from './components/LoginScreen';
import { Map, MessageCircle, UserCircle, Gift, Users, Bot } from 'lucide-react';
import { MOCK_USERS, MOCK_ISSUES } from './utils/mockData';
import { User, Issue, ChatMessage } from './types';

export default function App() {
  // Start with no user to show login screen
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'report' | 'chat' | 'ai-help' | 'rewards' | 'profile'>('map');
  const [issues, setIssues] = useState<Issue[]>(MOCK_ISSUES);

  const handleIssueReported = (issue: Issue) => {
    const newIssues = [...issues, issue];
    setIssues(newIssues);
    
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        points: currentUser.points + 50,
        reportedIssues: [...currentUser.reportedIssues, issue.id]
      };
      setCurrentUser(updatedUser);
    }
    
    setActiveTab('map');
  };

  const handleIssueResolved = (issueId: string) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId ? { ...issue, status: 'resolved' as const } : issue
    );
    setIssues(updatedIssues);
    
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        points: currentUser.points + 100,
        resolvedIssues: [...currentUser.resolvedIssues, issueId]
      };
      setCurrentUser(updatedUser);
    }
  };

  const handleRewardPurchased = (cost: number) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      points: currentUser.points - cost
    });
  };

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'map' && (
          <MapView 
            issues={issues} 
            currentUser={currentUser}
            onIssueResolved={handleIssueResolved}
          />
        )}
        {activeTab === 'report' && (
          <ReportIssue 
            currentUser={currentUser}
            onIssueReported={handleIssueReported}
          />
        )}
        {activeTab === 'chat' && (
          <CommunityChat currentUser={currentUser} />
        )}
        {activeTab === 'ai-help' && (
          <AIHelper currentUser={currentUser} />
        )}
        {activeTab === 'rewards' && (
          <RewardsMarketplace 
            userPoints={currentUser.points}
            onRewardPurchased={handleRewardPurchased}
          />
        )}
        {activeTab === 'profile' && (
          <Profile user={currentUser} issues={issues} />
        )}
      </div>

      {/* Scrollable Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex overflow-x-auto no-scrollbar py-2 px-2 gap-2 snap-x">
          <NavButton 
            active={activeTab === 'map'} 
            onClick={() => setActiveTab('map')} 
            icon={Map} 
            label="Map" 
          />
          <NavButton 
            active={activeTab === 'report'} 
            onClick={() => setActiveTab('report')} 
            icon={MessageCircle} 
            label="Report" 
          />
          <NavButton 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            icon={Users} 
            label="Chat" 
          />
          <NavButton 
            active={activeTab === 'ai-help'} 
            onClick={() => setActiveTab('ai-help')} 
            icon={Bot} 
            label="AI Help" 
          />
          <NavButton 
            active={activeTab === 'rewards'} 
            onClick={() => setActiveTab('rewards')} 
            icon={Gift} 
            label="Rewards" 
          />
          <NavButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
            icon={UserCircle} 
            label="Profile" 
          />
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl transition-all snap-center ${
        active ? 'text-green-600 bg-green-50 font-medium' : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
      <span className="text-[10px] leading-none">{label}</span>
    </button>
  );
}
