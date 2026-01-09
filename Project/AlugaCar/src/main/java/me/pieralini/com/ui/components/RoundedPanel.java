package me.pieralini.com.ui.components;

import javax.swing.*;
import java.awt.*;

public class RoundedPanel extends JPanel {
    private final int radius;
    private final Color bgColor;

    public RoundedPanel(int radius, Color bgColor) {
        this.radius = radius;
        this.bgColor = bgColor;
        setOpaque(false);
    }

    @Override
    protected void paintComponent(Graphics g) {
        int width = getWidth();
        int height = getHeight();

        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // fundo plano
        g2.setColor(bgColor);
        g2.fillRoundRect(0, 0, width, height, radius, radius);

        // borda sutil
        g2.setColor(new Color(230, 230, 230));
        g2.setStroke(new BasicStroke(1f));
        g2.drawRoundRect(0, 0, width-1, height-1, radius, radius);

        g2.dispose();
        super.paintComponent(g);
    }
}