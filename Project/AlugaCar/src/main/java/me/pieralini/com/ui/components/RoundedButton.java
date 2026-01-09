package me.pieralini.com.ui.components;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class RoundedButton extends JButton {
    private boolean hover = false;
    private boolean pressed = false;

    public RoundedButton(String text) {
        super(text);
        setContentAreaFilled(false);
        setFocusPainted(false);
        setForeground(Color.WHITE);
        setFont(new Font("SansSerif", Font.BOLD, 14));
        setBorder(BorderFactory.createEmptyBorder(8, 14, 8, 14));
        setOpaque(false);
        setHorizontalAlignment(SwingConstants.CENTER);

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                hover = true;
                repaint();
            }

            @Override
            public void mouseExited(MouseEvent e) {
                hover = false;
                pressed = false;
                repaint();
            }

            @Override
            public void mousePressed(MouseEvent e) {
                pressed = true;
                repaint();
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                pressed = false;
                repaint();
            }
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        int width = getWidth();
        int height = getHeight();

        int arc = Math.min(12, height / 2);
        Color base = new Color(0x2196F3); // azul moderno
        Color bg = base;
        if (pressed) {
            bg = base.darker();
        } else if (hover) {
            bg = base.brighter();
        }

        g2.setColor(bg);
        g2.fillRoundRect(0, 0, width, height, arc, arc);

        // leve overlay para brilho
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.08f));
        g2.setColor(Color.WHITE);
        g2.fillRoundRect(0, 0, width, height / 2, arc, arc);
        g2.setComposite(AlphaComposite.SrcOver);

        FontMetrics fm = g2.getFontMetrics();
        String text = getText();
        int textWidth = fm.stringWidth(text);
        int textX = (width - textWidth) / 2;
        int textY = (height - fm.getHeight()) / 2 + fm.getAscent();

        g2.setColor(getForeground());
        g2.setFont(getFont());
        g2.drawString(text, textX, textY);

        g2.dispose();
    }

    @Override
    public void paintBorder(Graphics g) {
        // no border
    }

    @Override
    public boolean isOpaque() {
        return false;
    }
}