import queue

class MessageAnnouncer:

  def __init__(self):
    self.listeners = {}

  def listen(self, username):
    q = queue.Queue(maxsize=5)
    if username in self.listeners:
      self.listeners[username].append(q)
    else:
      self.listeners.update({
        username: [q]
      })
    return q

  def announce(self, username, msg):
    if username in self.listeners:
      for i in reversed(range(len(self.listeners[username]))):
        try:
          self.listeners[username][i].put_nowait(msg)
        except queue.Full:
          del self.listeners[username][i]