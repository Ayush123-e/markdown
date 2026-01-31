const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createSession = async (req, res) => {
  try {
    const { title, videoUrl, thumbnail, content } = req.body;
    const userId = req.user.id;

    const session = await prisma.studySession.create({
      data: {
        title,
        videoUrl,
        thumbnail,
        content,
        userId,
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Failed to create session" });
  }
};

const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await prisma.studySession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await prisma.studySession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch session" });
  }
};

const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, thumbnail } = req.body;

    const session = await prisma.studySession.update({
      where: { id },
      data: { title, content, thumbnail },
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to update session" });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.studySession.delete({
      where: { id },
    });
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete session" });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
};
