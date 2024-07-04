import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import AuthReducer from "./Auth/AuthReducer";
import ActivityReducer from "./Activity/ActivityReducer";
import WalletReducer from "./Wallet/WalletReducer";
import FileReducer from "./File/FileReducer";
import ForumReducer from "./Forum/ForumReducer";
import AppGlobalReducer from "./AppGlobal/AppGlobalReducer";
import ExploreReducer from "./Explore/ExploreReducer";
import ChatReducer from "./Chat/ChatReducer";
import DocReducer from "./Doc/DocReducer";
import DocSignReducer from './DocSign/DocSignReducer'
import DiscussReducer from "./Discuss/DiscussionReducer";
import DashboardReducer from "./Dashboard/DashboardReducer";
import ScheduleReducer from "./Schedule/ScheduleReducer";
import TeamReducer from "./Team/TeamReducer";

import TaskReducer from "./Task/TaskReducer";
import PipelineReducer from "./Pipeline/PipelineReducer";
import IssueReducer from "./Issue/IssueReducer";
import ModerationReducer from "./Moderation/ModerationReducer";
import CommentReducer from "./Comment/CommentReducer";
import ProjectReducer from "./Project/ProjectReducer";
import ProfileReducer from "./Profiles/ProfileReducer";
import RoleMapReducer from "./RoleMap/RoleMapReducer";

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    appGlobal: AppGlobalReducer,
    auth: AuthReducer,
    activity: ActivityReducer,

    chat: ChatReducer,
    comment: CommentReducer,
    discussion: DiscussReducer,
    dashboard: DashboardReducer,
    doc: DocReducer,
    docSign: DocSignReducer, 
    explore: ExploreReducer,

    file: FileReducer,
    forum: ForumReducer,
    issue: IssueReducer,
    moderation: ModerationReducer,

    pipeline: PipelineReducer,
    profile: ProfileReducer,
    project: ProjectReducer,

    team: TeamReducer,
    task: TaskReducer,
    wallet: WalletReducer,
    schedule: ScheduleReducer,
    roleMap: RoleMapReducer,
  });

export default rootReducer;
