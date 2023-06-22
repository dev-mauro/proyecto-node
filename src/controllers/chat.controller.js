import messageModel from "../Dao/models/message.model.js";

class ChatController {

  getChatLog = async (req, res) => {
    const response = await messageModel.find();
    const messages = response.map( message => message.toObject());

    res.render('chat', {
      messages,
      script: 'chat.js',
      style: 'chat'
    });
  }

  postMessage = async(req, res) => {
    const { user, message } = req.body;
    const io = req.app.get('io');

    try {
      const result = await messageModel.create( { user, message } );
      io.emit('new-message', {
        user,
        message
      });
      res.send({
        "status": "success",
        newMessage: result
      });
      
    } catch(error) {
      console.log(error);
      res.status(500).send({
        "status": "bad request",
      });
    }
  }

}

export default new ChatController();