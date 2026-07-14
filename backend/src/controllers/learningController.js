import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// COURSE CONTROLLERS
// ==========================================

/**
 * Get all courses (Public list with search & category filter).
 */
export const getCourses = async (req, res, next) => {
  try {
    const { search, category, difficulty } = req.query;
    const where = { status: 'Active' };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { instructor: { contains: search } }
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single course by ID (Public).
 */
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findFirst({
      where: { id, status: 'Active' }
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all courses for administration (Admin only).
 */
export const getAdminCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { created_at: 'desc' }
    });
    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new course (Admin only).
 */
export const createCourse = async (req, res, next) => {
  try {
    const { thumbnail, title, description, category, instructor, duration, difficulty, youtube_video, notes, downloads } = req.body;
    if (!title || !category || !youtube_video) {
      return res.status(400).json({ success: false, message: 'Title, category, and YouTube video link are required.' });
    }

    const course = await prisma.course.create({
      data: {
        thumbnail,
        title,
        description,
        category,
        instructor,
        duration,
        difficulty,
        youtube_video,
        notes,
        downloads,
        status: 'Active'
      }
    });

    return res.status(201).json({ success: true, message: 'Course created successfully.', data: course });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing course (Admin only).
 */
export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { thumbnail, title, description, category, instructor, duration, difficulty, youtube_video, notes, downloads, status } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        thumbnail,
        title,
        description,
        category,
        instructor,
        duration,
        difficulty,
        youtube_video,
        notes,
        downloads,
        status
      }
    });

    return res.status(200).json({ success: true, message: 'Course updated successfully.', data: course });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a course (Admin only).
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// RESOURCE CONTROLLERS
// ==========================================

/**
 * Get all resources (Public list with search & filter).
 */
export const getResources = async (req, res, next) => {
  try {
    const { search, category, type } = req.query;
    const where = { status: 'Active' };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ success: true, data: resources });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all resources for administration (Admin only).
 */
export const getAdminResources = async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { created_at: 'desc' }
    });
    return res.status(200).json({ success: true, data: resources });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new resource (Admin only).
 */
export const createResource = async (req, res, next) => {
  try {
    const { title, description, type, category, url, download_path } = req.body;
    if (!title || !type || !category) {
      return res.status(400).json({ success: false, message: 'Title, type, and category are required.' });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        type,
        category,
        url,
        download_path,
        status: 'Active'
      }
    });

    return res.status(201).json({ success: true, message: 'Resource created successfully.', data: resource });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing resource (Admin only).
 */
export const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, type, category, url, download_path, status } = req.body;

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title,
        description,
        type,
        category,
        url,
        download_path,
        status
      }
    });

    return res.status(200).json({ success: true, message: 'Resource updated successfully.', data: resource });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a resource (Admin only).
 */
export const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.resource.delete({ where: { id } });
    return res.status(200).json({ success: true, message: 'Resource deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
