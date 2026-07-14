import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export const cardService = {
  /**
   * Generates a QR Code as a PNG Buffer referencing the public profile link.
   */
  async generateQrCodeBuffer(memberId) {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const profileUrl = `${appUrl}/member/${memberId}`;
    return await QRCode.toBuffer(profileUrl, {
      type: 'png',
      margin: 1,
      width: 250,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    });
  },

  /**
   * Generates a dual-page (Front/Back) PDF Member Card in standard PVC dimensions (CR80 ratio).
   */
  async generateMemberCardPdf(user) {
    try {
      const pdfDoc = await PDFDocument.create();
      
      // Standard CR80 Ratio scaled to 306pt width x 485pt height (Portrait)
      const pageFront = pdfDoc.addPage([306, 485]);
      const pageBack = pdfDoc.addPage([306, 485]);
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Helper to parse Hex color to PDF-lib rgb
      const hexToRgb = (hexStr) => {
        let hex = hexStr || '#21316b';
        if (hex.startsWith('#')) hex = hex.substring(1);
        if (hex.length === 3) {
          hex = hex.split('').map(c => c + c).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        return rgb(r, g, b);
      };

      // Determine profile status and dynamic styling from Role
      let primaryColor = rgb(33 / 255, 49 / 255, 107 / 255); // Default Member Brand Blue (#21316B)
      let accentColor = rgb(76 / 255, 175 / 255, 80 / 255);  // Default Member Green (#4CAF50)
      let cardBadge = 'COMMUNITY MEMBER';
      let roleLabel = (user.profession || user.occupation || 'Member').toUpperCase();
      let borderStyle = false;

      if (user.role) {
        const role = user.role;
        const design = role.card?.design_template || 'standard';
        
        // Define primary based on template
        if (design === 'mentor') {
          primaryColor = rgb(15 / 255, 23 / 255, 42 / 255); // Slate black
          borderStyle = true;
        } else if (design === 'leadership') {
          primaryColor = rgb(15 / 255, 23 / 255, 42 / 255); // Slate black or navy royal
          borderStyle = true;
        } else if (design === 'volunteer') {
          primaryColor = rgb(12 / 255, 74 / 255, 96 / 255);  // Deep Teal
        } else {
          primaryColor = rgb(33 / 255, 49 / 255, 107 / 255); // Default navy
        }

        if (role.theme?.accent_color) {
          accentColor = hexToRgb(role.theme.accent_color);
        } else if (role.card?.accent_color) {
          accentColor = hexToRgb(role.card.accent_color);
        }

        cardBadge = (role.badge?.badge_name || role.name).toUpperCase();
        
        if (role.category === 'Leadership' || role.category === 'Department Leads') {
          roleLabel = `${role.name} - ${user.profession || 'Director'}`.toUpperCase();
        } else if (role.key === 'mentor') {
          roleLabel = `MENTOR - ${user.mentor_industry || 'EXPERT'}`.toUpperCase();
        } else if (role.key === 'volunteer' || role.key === 'senior-volunteer') {
          roleLabel = `VOLUNTEER - ${user.volunteer_department || 'TEAM'}`.toUpperCase();
        } else {
          roleLabel = `${role.name} - ${user.profession || 'Community Member'}`.toUpperCase();
        }
      } else {
        // Fallback to legacy logic
        if (user.is_mentor && user.mentor_status === 'Approved') {
          primaryColor = rgb(15 / 255, 23 / 255, 42 / 255);
          accentColor = rgb(212 / 255, 175 / 255, 55 / 255);
          cardBadge = 'OFFICIAL MENTOR';
          roleLabel = `MENTOR - ${user.mentor_industry || 'EXPERT'}`.toUpperCase();
          borderStyle = true;
        } else if (user.is_volunteer && user.volunteer_status === 'Approved') {
          primaryColor = rgb(12 / 255, 74 / 255, 96 / 255);
          accentColor = rgb(6 / 255, 182 / 255, 212 / 255);
          cardBadge = (user.volunteer_role || 'COMMUNITY VOLUNTEER').toUpperCase();
          roleLabel = (user.volunteer_department || 'VOLUNTEER TEAM').toUpperCase();
        }
      }

      // ==========================================
      // PAGE 1: FRONT SIDE
      // ==========================================
      // Draw Card Background
      pageFront.drawRectangle({
        x: 0,
        y: 0,
        width: 306,
        height: 485,
        color: primaryColor
      });

      // Draw Top Accent Stripe
      pageFront.drawRectangle({
        x: 0,
        y: 473,
        width: 306,
        height: 12,
        color: accentColor
      });

      // Card Border
      if (borderStyle) {
        pageFront.drawRectangle({
          x: 10,
          y: 10,
          width: 286,
          height: 453,
          borderColor: accentColor,
          borderWidth: 1.5
        });
      }

      // Header Text
      pageFront.drawText('EMPOWER JHANG', {
        x: 30,
        y: 430,
        size: 18,
        font: helveticaBold,
        color: rgb(1, 1, 1)
      });
      pageFront.drawText('Learn • Connect • Grow', {
        x: 30,
        y: 414,
        size: 9,
        font: helveticaFont,
        color: accentColor
      });

      // Embed Member Profile Photo
      let photoEmbedded = false;
      if (user.profile_photo) {
        try {
          const cleanPath = user.profile_photo.startsWith('http')
            ? user.profile_photo.substring(user.profile_photo.indexOf('/uploads'))
            : user.profile_photo;

          const uploadPath = process.env.UPLOAD_PATH || 
            (fs.existsSync(path.join(process.cwd(), 'uploads')) 
              ? path.join(process.cwd(), 'uploads') 
              : path.join(process.cwd(), '../uploads'));
          let absolutePhotoPath;
          if (cleanPath.startsWith('/uploads/')) {
            absolutePhotoPath = path.join(uploadPath, cleanPath.substring('/uploads/'.length));
          } else if (cleanPath.startsWith('uploads/')) {
            absolutePhotoPath = path.join(uploadPath, cleanPath.substring('uploads/'.length));
          } else {
            absolutePhotoPath = path.join(process.cwd(), cleanPath);
          }

          if (fs.existsSync(absolutePhotoPath)) {
            const photoBytes = fs.readFileSync(absolutePhotoPath);
            let image;
            if (absolutePhotoPath.toLowerCase().endsWith('.png')) {
              image = await pdfDoc.embedPng(photoBytes);
            } else {
              image = await pdfDoc.embedJpg(photoBytes);
            }

            // Center image (Width: 110pt, Height: 110pt)
            pageFront.drawImage(image, {
              x: 98,
              y: 280,
              width: 110,
              height: 110
            });

            // Frame border
            pageFront.drawRectangle({
              x: 98,
              y: 280,
              width: 110,
              height: 110,
              borderColor: rgb(1, 1, 1),
              borderWidth: 2
            });

            photoEmbedded = true;
          }
        } catch (photoErr) {
          logger.error(`Failed to embed photo in PDF Card: ${photoErr.message}`);
        }
      }

      // Draw placeholder if photo is missing
      if (!photoEmbedded) {
        pageFront.drawRectangle({
          x: 98,
          y: 280,
          width: 110,
          height: 110,
          color: rgb(44 / 255, 62 / 255, 130 / 255),
          borderColor: rgb(1, 1, 1),
          borderWidth: 1.5
        });
        pageFront.drawText('PHOTO', {
          x: 135,
          y: 330,
          size: 11,
          font: helveticaBold,
          color: rgb(1, 1, 1)
        });
      }

      // Member Details
      pageFront.drawText('FULL NAME', { x: 30, y: 245, size: 7, font: helveticaBold, color: rgb(150 / 255, 160 / 255, 190 / 255) });
      pageFront.drawText(user.full_name.toUpperCase(), { x: 30, y: 228, size: 13, font: helveticaBold, color: rgb(1, 1, 1) });

      pageFront.drawText('POSITION / TITLE', { x: 30, y: 200, size: 7, font: helveticaBold, color: rgb(150 / 255, 160 / 255, 190 / 255) });
      pageFront.drawText(roleLabel, { x: 30, y: 185, size: 10, font: helveticaFont, color: accentColor });

      pageFront.drawText('DISTRICT', { x: 30, y: 157, size: 7, font: helveticaBold, color: rgb(150 / 255, 160 / 255, 190 / 255) });
      pageFront.drawText(user.district || 'Jhang', { x: 30, y: 142, size: 10, font: helveticaFont, color: rgb(1, 1, 1) });

      pageFront.drawText('MEMBER ID', { x: 180, y: 157, size: 7, font: helveticaBold, color: rgb(150 / 255, 160 / 255, 190 / 255) });
      pageFront.drawText(user.member_id, { x: 180, y: 142, size: 11, font: helveticaBold, color: accentColor });

      // Issue date & badge
      const issueDate = new Date(user.joined_at || user.registration_date || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      pageFront.drawText('ISSUE DATE', { x: 30, y: 112, size: 7, font: helveticaBold, color: rgb(150 / 255, 160 / 255, 190 / 255) });
      pageFront.drawText(issueDate, { x: 30, y: 97, size: 9, font: helveticaFont, color: rgb(1, 1, 1) });

      // Verification Badge (Attractively styled)
      pageFront.drawRectangle({
        x: 180,
        y: 92,
        width: 96,
        height: 18,
        color: accentColor,
        borderRadius: 4
      });
      pageFront.drawText(cardBadge.substring(0, 18), {
        x: 188,
        y: 98,
        size: 6,
        font: helveticaBold,
        color: rgb(15 / 255, 23 / 255, 42 / 255)
      });

      // ==========================================
      // PAGE 2: BACK SIDE
      // ==========================================
      pageBack.drawRectangle({
        x: 0,
        y: 0,
        width: 306,
        height: 485,
        color: rgb(15 / 255, 23 / 255, 42 / 255) // Dark background for all backs
      });

      // Embed QR Code centered (Width: 140pt, Height: 140pt)
      const qrBuffer = await this.generateQrCodeBuffer(user.member_id);
      const pdfQrImage = await pdfDoc.embedPng(qrBuffer);
      pageBack.drawImage(pdfQrImage, {
        x: 83,
        y: 280,
        width: 140,
        height: 140
      });

      // Verification instruction
      pageBack.drawText('SCAN QR TO VERIFY PROFILE', {
        x: 75,
        y: 255,
        size: 8,
        font: helveticaBold,
        color: accentColor
      });

      // Community Mission Details
      pageBack.drawText('EMPOWER JHANG COMMUNITY', { x: 30, y: 210, size: 10, font: helveticaBold, color: rgb(1, 1, 1) });
      const descLine1 = 'Empower Jhang is a digital community platform';
      const descLine2 = 'created for the youth to learn skills, connect,';
      const descLine3 = 'and grow together as a community.';
      pageBack.drawText(descLine1, { x: 30, y: 190, size: 8, font: helveticaFont, color: rgb(180 / 255, 190 / 255, 210 / 255) });
      pageBack.drawText(descLine2, { x: 30, y: 177, size: 8, font: helveticaFont, color: rgb(180 / 255, 190 / 255, 210 / 255) });
      pageBack.drawText(descLine3, { x: 30, y: 164, size: 8, font: helveticaFont, color: rgb(180 / 255, 190 / 255, 210 / 255) });

      // Motto
      pageBack.drawText('Learn • Connect • Grow', {
        x: 30,
        y: 130,
        size: 11,
        font: helveticaBold,
        color: accentColor
      });

      // Contact detail lines
      pageBack.drawText('Web: www.empowerjhang.org', { x: 30, y: 95, size: 8, font: helveticaFont, color: rgb(180 / 255, 190 / 255, 210 / 255) });
      pageBack.drawText('Email: info@empowerjhang.org', { x: 30, y: 82, size: 8, font: helveticaFont, color: rgb(180 / 255, 190 / 255, 210 / 255) });

      // Return notice
      pageBack.drawText('If found, please contact Empower Jhang Community.', {
        x: 30,
        y: 45,
        size: 7,
        font: helveticaFont,
        color: rgb(120 / 255, 130 / 255, 150 / 255)
      });

      // Copyright
      pageBack.drawText('Copyright © 2026 Empower Jhang. All rights reserved.', {
        x: 30,
        y: 32,
        size: 7,
        font: helveticaFont,
        color: rgb(120 / 255, 130 / 255, 150 / 255)
      });

      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (err) {
      logger.error(`Dual-page PDF Member Card Generation Error: ${err.message}`);
      throw new Error('Failed to generate dual-page member card PDF.');
    }
  }
};
