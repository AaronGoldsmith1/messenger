import axios from "axios";
import SocketUtil from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  updatedMessagesReadStatus,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      SocketUtil.connectSocket(data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    dispatch(gotUser(data));
    SocketUtil.connectSocket(data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    dispatch(gotUser(data));
    SocketUtil.connectSocket(data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    dispatch(gotUser({}));
    SocketUtil.disconnectSocketOnLogout(id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    SocketUtil.sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const updateMessagesReadStatus = (body) => async (dispatch) => {
  try {
    if (body.messages) {
      const unreadCount = body.unreadCount;

      if (unreadCount > 0) {
        const { data } = await axios.patch("/api/messages/updateReadStatus", body)
        dispatch(updatedMessagesReadStatus(data))
        SocketUtil.updateReadStatus(data)
      } 
    } 
  } catch (error) {
    console.error(error);
  }
}

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
