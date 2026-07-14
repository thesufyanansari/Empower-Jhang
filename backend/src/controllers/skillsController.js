import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetch all categories and active skills grouped (Public lookup).
 */
export const getCategoriesAndSkills = async (req, res, next) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      where: { status: 'Active' },
      orderBy: { display_order: 'asc' },
      include: {
        skills: {
          where: { status: 'Active' },
          orderBy: { display_order: 'asc' }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch all categories including disabled ones (Admin only).
 */
export const getAdminCategoriesAndSkills = async (req, res, next) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { display_order: 'asc' },
      include: {
        skills: {
          orderBy: { display_order: 'asc' }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new skill category (Admin only).
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, display_order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const category = await prisma.skillCategory.create({
      data: {
        name,
        display_order: display_order !== undefined ? parseInt(display_order) : 0,
        status: 'Active'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing category (Admin only).
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, display_order, status } = req.body;

    const category = await prisma.skillCategory.update({
      where: { id },
      data: {
        name,
        display_order: display_order !== undefined ? parseInt(display_order) : undefined,
        status
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a category (Admin only).
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.skillCategory.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new sub-skill (Admin only).
 */
export const createSkill = async (req, res, next) => {
  try {
    const { name, categoryId, display_order } = req.body;
    if (!name || !categoryId) {
      return res.status(400).json({ success: false, message: 'Skill name and categoryId are required.' });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        categoryId,
        display_order: display_order !== undefined ? parseInt(display_order) : 0,
        status: 'Active'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Skill created successfully.',
      data: skill
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing skill (Admin only).
 */
export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, categoryId, display_order, status } = req.body;

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        categoryId,
        display_order: display_order !== undefined ? parseInt(display_order) : undefined,
        status
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Skill updated successfully.',
      data: skill
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a skill (Admin only).
 */
export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: 'Skill deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};
