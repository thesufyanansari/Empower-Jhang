import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all roles
export async function getRoles(req, res, next) {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { display_order: 'asc' },
      include: {
        badge: true,
        theme: true,
        card: true,
        permissions: true
      }
    });
    return res.json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
}

// Create role
export async function createRole(req, res, next) {
  try {
    const { name, category, display_order, badge, theme, card, permissions } = req.body;
    const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const role = await prisma.role.create({
      data: {
        name,
        key,
        category,
        display_order: parseInt(display_order) || 0,
        badge: {
          create: {
            badge_name: badge?.badge_name || `${name} Badge`,
            icon_name: badge?.icon_name || 'User',
            svg_template: badge?.svg_template || '<svg viewBox="0 0 24 24" class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>'
          }
        },
        theme: {
          create: {
            gradient_css: theme?.gradient_css || 'from-blue-600 to-indigo-700',
            accent_color: theme?.accent_color || '#2563eb',
            profile_header: theme?.profile_header || 'bg-gradient-to-r from-blue-600 to-indigo-700',
            border_style: theme?.border_style || 'border-blue-500/20',
            bg_pattern: theme?.bg_pattern || 'none',
            verification_style: theme?.verification_style || 'text-blue-500 fill-blue-500'
          }
        },
        card: {
          create: {
            design_template: card?.design_template || 'standard',
            badge_style: card?.badge_style || 'standard',
            accent_color: card?.accent_color || '#2563eb'
          }
        },
        permissions: {
          create: (permissions || []).map(p => ({ permission: p }))
        }
      },
      include: {
        badge: true,
        theme: true,
        card: true,
        permissions: true
      }
    });

    return res.status(201).json({ success: true, message: 'Role created successfully', data: role });
  } catch (err) {
    next(err);
  }
}

// Update role
export async function updateRole(req, res, next) {
  try {
    const { id } = req.params;
    const { name, category, display_order, status, badge, theme, card, permissions } = req.body;
    const key = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined;

    // Delete existing permissions and recreate them
    if (permissions) {
      await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        key: key || undefined,
        category,
        display_order: display_order !== undefined ? parseInt(display_order) : undefined,
        status,
        badge: badge ? {
          update: {
            badge_name: badge.badge_name,
            icon_name: badge.icon_name,
            svg_template: badge.svg_template
          }
        } : undefined,
        theme: theme ? {
          update: {
            gradient_css: theme.gradient_css,
            accent_color: theme.accent_color,
            profile_header: theme.profile_header,
            border_style: theme.border_style,
            bg_pattern: theme.bg_pattern,
            verification_style: theme.verification_style
          }
        } : undefined,
        card: card ? {
          update: {
            design_template: card.design_template,
            badge_style: card.badge_style,
            accent_color: card.accent_color
          }
        } : undefined,
        permissions: permissions ? {
          create: permissions.map(p => ({ permission: p }))
        } : undefined
      },
      include: {
        badge: true,
        theme: true,
        card: true,
        permissions: true
      }
    });

    return res.json({ success: true, message: 'Role updated successfully', data: role });
  } catch (err) {
    next(err);
  }
}

// Delete role
export async function deleteRole(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.role.delete({ where: { id } });
    return res.json({ success: true, message: 'Role deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// Reorder roles
export async function reorderRoles(req, res, next) {
  try {
    const { orders } = req.body; // Array of { id, display_order }
    for (const item of orders) {
      await prisma.role.update({
        where: { id: item.id },
        data: { display_order: parseInt(item.display_order) }
      });
    }
    return res.json({ success: true, message: 'Roles reordered successfully' });
  } catch (err) {
    next(err);
  }
}
