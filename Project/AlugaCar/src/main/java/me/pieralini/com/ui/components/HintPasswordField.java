package me.pieralini.com.ui.components;

import javax.swing.*;
import java.awt.*;

public class HintPasswordField extends JPasswordField {
    private final String hint;

    public HintPasswordField(String hint) {
        super();
        this.hint = hint;
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        if (getPassword().length == 0 && !isFocusOwner()) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setColor(new Color(160,160,160));
            Insets ins = getInsets();
            FontMetrics fm = g2.getFontMetrics();
            int yy = (getHeight() - fm.getHeight()) / 2 + fm.getAscent();
            g2.drawString(hint, ins.left + 4, yy);
            g2.dispose();
        }
    }
}