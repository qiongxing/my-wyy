import { createReducer, on } from '@ngrx/store';
import { setModalVisible, setModalType } from '../actions/member.action';

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
}

const initMemberState: MemberState = {
    modalVisible: false,
    modalType: ModalTypes.Default
}

export const memberReducer = createReducer(initMemberState,
    on(setModalVisible, (state, { modalVisible }) => ({ ...state, modalVisible })),
    on(setModalType, (state, { modalType }) => ({ ...state, modalType }))
)