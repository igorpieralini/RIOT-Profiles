package me.pieralini.com.ui.components;

import javax.swing.*;
import java.awt.*;

public class LogoLabel extends JLabel {
    private final int size;
    private final Color accent;
    private final double scale;

    public LogoLabel(int size, Color accent, double scale) {
        this.size = size;
        this.accent = accent;
        this.scale = scale;
        setPreferredSize(new Dimension(size, size));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int s = Math.min(getWidth(), getHeight()) - (int)Math.round(6*scale);
        int x = (getWidth() - s) / 2;
        int y = (getHeight() - s) / 2;

        Color fill = new Color(accent.getRed(), accent.getGreen(), accent.getBlue(), 230);
        g2.setColor(fill);
        g2.fillOval(x, y, s, s);

        g2.setColor(Color.WHITE);
        g2.fillRoundRect(x + (int)Math.round(6*scale), y + s/4,
                s - (int)Math.round(12*scale), s/4,
                (int)Math.round(6*scale), (int)Math.round(6*scale));

        g2.dispose();
    }
}