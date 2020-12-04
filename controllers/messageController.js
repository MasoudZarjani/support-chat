import Message from "../models/Message";
import User from "../models/User";
import constants from "../configs/constants";
import _ from "lodash";
import Utility from "../helpers/utility";
import userController from "./userController";

class messageController {
  async getMessages(token, page) {
    try {
      const {
        message: { receiver, sender },
      } = constants;
      let messageStatus = 0;
      var options = {
        sort: {
          createdAt: -1,
        },
        lean: true,
        page: page,
        limit: 10,
      };
      let messages = await Message.paginate(
        {
          $or: [{ from: token }, { to: token }],
        },
        options
      );
      messages.docs = _.reverse(messages.docs);
      messages.docs = _.map(messages.docs, (item) => {
        if (item.from == token) {
          messageStatus = sender;
        } else {
          Message.findOneAndUpdate(
            {
              _id: item._id,
            },
            {
              $set: {
                seen: 1,
              },
            },
            {
              new: true,
              useFindAndModify: false,
            },
            (err, doc) => {
              if (err) {
                console.log("Something wrong when updating data!");
              }
              item.seen = doc.seen;
            }
          );
          messageStatus = receiver;
        }
        return {
          messageStatus: messageStatus,
          id: item._id,
          createdAt: Utility.getPersianTime(item.createdAt),
          text: item.message,
          type: item.type,
          seen: item.seen,
          file: item.file,
          date: Utility.getPersianDate(item.createdAt),
        };
      });
      return messages;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  async getAllMessage(token, page) {
    try {
      const {
        message: { receiver, sender },
      } = constants;
      let messageStatus = 0;
      var options = {
        sort: {
          createdAt: 1,
        },
        lean: true,
        page: page,
        limit: 10,
      };
      let messages = await Message.find({
        token: token,
      });
      messages.docs = _.map(messages, (item) => {
        if (item.from == token) {
          messageStatus = sender;
        } else {
          Message.findOneAndUpdate(
            {
              _id: item._id,
            },
            {
              $set: {
                seen: 1,
              },
            },
            {
              new: true,
              useFindAndModify: false,
            },
            (err, doc) => {
              if (err) {
                console.log("Something wrong when updating data!");
              }
              item.seen = doc.seen;
            }
          );
          messageStatus = receiver;
        }
        owner = false;
        if (item.token == item.from) owner = true;
        return {
          messageStatus: messageStatus,
          id: item._id,
          createdAt: Utility.getPersianTime(item.createdAt),
          text: item.message,
          type: item.type,
          seen: item.seen,
          file: item.file,
          date: Utility.getPersianDate(item.createdAt),
          owner: owner,
        };
      });
      return {
        docs: messages,
      };
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  async setMessage(data, token) {
    try {
      if (typeof data.userToken === "undefined" || data.userToken == null) {
        data.userToken = "138d902d-9fc4-4ddf-a323-3bc89e5b0061";
      }

      if (data.type == 0) {
        return new Message({
          message: data.text,
          from: token,
          to: data.userToken,
          type: data.type,
          seen: 0,
        }).save();
      } else if (data.type == 1) {
        return new Message({
          message: data.text,
          from: token,
          to: data.userToken,
          type: data.type,
          file: {
            path: data.fileName,
            mime: data.fileType,
            size: data.fileSize,
          },
          seen: 0,
        }).save();
      }
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  async getAllMessages() {
    try {
      let messages = await Message.find().sort("createdAt");
      res.json(messages);
    } catch (err) {
      console.warn(err);
      return null;
    }
  }
}

export default new messageController();
