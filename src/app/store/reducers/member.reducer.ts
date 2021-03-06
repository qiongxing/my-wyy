import { Action, createReducer, on } from '@ngrx/store';
import { setModalVisible, setModalType, setUserId, setLikeId, setShareInfo } from '../actions/member.action';

export enum ModalTypes {
    Register = 'register',
    LoginByPhone = 'loginByPhone',
    Share = 'share',
    Like = 'like',
    Default = 'default'
}

export type ShareInfo = {
    id: string;
    type: string;
    txt: string;
}

export type MemberState = {
    modalVisible: boolean;
    modalType: ModalTypes;
    userId: string;
    likeId: string;
    shareInfo?: ShareInfo;
}

const initMemberState: MemberState = {
    modalVisible: false,
    modalType: ModalTypes.Default,
    userId: '',
    likeId: '',
}

const reducer = createReducer(initMemberState,
    on(setModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
    on(setModalType, (state, { modalType }) => ({ ...state, modalType })),
    on(setUserId, (state, { userId }) => ({ ...state, userId })),
    on(setLikeId, (state, { likeId }) => ({ ...state, likeId })),
    on(setShareInfo, (state, { info }) => ({ ...state, shareInfo: info })),
)

export function memberReducer(state: MemberState, action: Action) {
    return reducer(state, action);
}