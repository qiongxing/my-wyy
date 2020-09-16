import { createReducer, on } from '@ngrx/store';
import { setModalVisible, setModalType, setUserId } from '../actions/member.action';

export enum ModalTypes {
    Register = 'register',
    LoginByPhone = 'loginByPhone',
    Share = 'share',
    Like = 'like',
    Default = 'default'
}

export type MemberState = {
    modalVisible: boolean;
    modalType: ModalTypes;
    userId: string;
}

const initMemberState: MemberState = {
    modalVisible: false,
    modalType: ModalTypes.Default,
    userId: ''
}

export const memberReducer = createReducer(initMemberState,
    on(setModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
    on(setModalType, (state, { modalType }) => ({ ...state, modalType })),
    on(setUserId, (state, { userId }) => ({ ...state, userId })),
)