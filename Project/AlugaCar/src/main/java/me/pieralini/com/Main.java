package me.pieralini.com;

import me.pieralini.com.ui.LoginFrame;
import me.pieralini.com.util.ConfigLoader;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Map;

public class Main {

    public static void main(String[] args) throws IOException, UnsupportedLookAndFeelException, ClassNotFoundException, InstantiationException, IllegalAccessException {
        setNimbusLookAndFeel();

        Map<String, String> cfg = ConfigLoader.loadConfig();

        BufferedImage icon = loadAppIcon();

        SwingUtilities.invokeLater(() ->
                new LoginFrame(cfg, icon)
        );
    }

    private static BufferedImage loadAppIcon() throws IOException {

            BufferedImage img = ImageIO.read(
                    Main.class.getResourceAsStream("/car.png")
            );

            System.out.println("✓ Ícone carregado: "
                    + img.getWidth() + "x" + img.getHeight());

            return img;
    }

    private static void setNimbusLookAndFeel() throws UnsupportedLookAndFeelException, ClassNotFoundException, InstantiationException, IllegalAccessException {

        for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
            if ("Nimbus".equals(info.getName())) {
                UIManager.setLookAndFeel(info.getClassName());
                break;
            }
        }

    }
}
