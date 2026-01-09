package me.pieralini.com.util;

import javax.swing.*;
import java.awt.*;

public class UIHelper {

    public enum MessageType {
        ERROR,
        SUCCESS,
        INFO
    }

    public static void statusMessage(Component target, String message, MessageType type) {
        Color color = new Color(120,120,120);
        if (type == MessageType.ERROR) {
            color = new Color(200,40,40);
        } else if (type == MessageType.SUCCESS) {
            color = new Color(40,120,40);
        }

        if (target instanceof JLabel) {
            JLabel lbl = (JLabel) target;
            lbl.setText(message);
            lbl.setForeground(color);
        } else if (target instanceof Container) {
            for (Component c : ((Container) target).getComponents()) {
                if (c instanceof JLabel) {
                    JLabel l = (JLabel) c;
                    l.setText(message);
                    l.setForeground(color);
                    return;
                }
            }
        }
    }

    public static JComponent wrapWithIcon(JComponent field, String kind, double scale) {
        JPanel p = new JPanel(new BorderLayout());
        p.setOpaque(false);
        p.add(field, BorderLayout.CENTER);

        JLabel icon = new JLabel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                int h = getHeight();
                int size = Math.min(18, Math.max(12, h - 8));
                int x = (getWidth() - size) / 2;
                int y = (h - size) / 2;
                g2.setColor(new Color(150,150,150));

                if ("user".equals(kind)) {
                    int head = size/2;
                    g2.fillOval(x + (size-head)/2, y, head, head);
                    g2.fillRoundRect(x, y + head + 2, size, size - head, 6, 6);
                } else if ("lock".equals(kind)) {
                    g2.fillRoundRect(x, y + 4, size, size - 6, 4, 4);
                    g2.drawArc(x + 2, y - 2, size - 4, size - 6, 0, 180);
                }

                g2.dispose();
            }
        };

        int iconWidth = 34;
        int prefFieldH = field.getPreferredSize().height > 0 ? field.getPreferredSize().height : 28;
        icon.setPreferredSize(new Dimension(iconWidth, prefFieldH));
        p.add(icon, BorderLayout.WEST);

        Dimension fp = field.getPreferredSize();
        if (fp.width <= 0) fp = new Dimension(200, prefFieldH);
        p.setPreferredSize(new Dimension(fp.width + iconWidth, Math.max(prefFieldH, fp.height)));

        return p;
    }
}