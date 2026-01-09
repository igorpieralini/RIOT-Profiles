package me.pieralini.com.ui;

import me.pieralini.com.ui.components.*;
import me.pieralini.com.util.UIHelper;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.util.Map;

public class LoginFrame extends JFrame {

    private static final Color BG = new Color(245, 247, 248);
    private static final Color PRIMARY = new Color(17, 88, 140);
    private static final Color ACCENT = new Color(0x00A79D);

    private final Map<String, String> config;
    private final double scale;
    private final BufferedImage appIcon;

    public LoginFrame(Map<String, String> config, BufferedImage icon) {
        super("AlugaCar — Login");

        this.config = config;
        this.appIcon = icon;

        if (appIcon != null) {
            setIconImage(appIcon);

            if (Taskbar.isTaskbarSupported()) {
                try {
                    Taskbar.getTaskbar().setIconImage(appIcon);
                } catch (Exception ignored) {}
            }
        }

        Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
        this.scale = Math.max(0.75, Math.min(1.25, screen.width / 1366.0));

        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(s(720), s(520));
        setMinimumSize(new Dimension(s(520), s(380)));
        setLocationRelativeTo(null);
        getContentPane().setBackground(BG);
        setLayout(new BorderLayout());

        add(createTop(), BorderLayout.NORTH);
        add(createCenter(), BorderLayout.CENTER);

        setVisible(true);
    }

    /* ===================== TOP ===================== */

    private JPanel createTop() {
        JPanel top = new JPanel(new BorderLayout());
        top.setOpaque(false);
        top.setPreferredSize(new Dimension(getWidth(), s(120)));
        top.setBorder(BorderFactory.createEmptyBorder(s(18), s(24), s(12), s(24)));

        top.add(createBrand(), BorderLayout.WEST);

        JLabel welcome = new JLabel("Bem-vindo de volta");
        welcome.setForeground(new Color(110, 120, 130));
        welcome.setFont(new Font("SansSerif", Font.PLAIN, s(12)));

        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        right.setOpaque(false);
        right.add(welcome);

        top.add(right, BorderLayout.EAST);
        return top;
    }

    private JPanel createBrand() {
        JPanel brand = new JPanel(new FlowLayout(FlowLayout.LEFT, s(12), 0));
        brand.setOpaque(false);

        int logoSize = Math.max(s(56), (int) (getWidth() * 0.11));

        if (appIcon != null) {
            double ratio = Math.min(
                    (double) logoSize / appIcon.getWidth(),
                    (double) logoSize / appIcon.getHeight()
            );

            int w = Math.max(1, (int) (appIcon.getWidth() * ratio));
            int h = Math.max(1, (int) (appIcon.getHeight() * ratio));

            JLabel logo = new JLabel(new ImageIcon(
                    appIcon.getScaledInstance(w, h, Image.SCALE_SMOOTH)
            ));

            logo.setPreferredSize(new Dimension(logoSize, logoSize));
            logo.setHorizontalAlignment(SwingConstants.CENTER);
            brand.add(logo);
        } else {
            brand.add(new LogoLabel(logoSize, ACCENT, scale));
        }

        JLabel title = new JLabel("AlugaCar");
        title.setForeground(PRIMARY.darker());
        title.setFont(new Font("SansSerif", Font.BOLD, s(26)));

        brand.add(title);
        return brand;
    }

    /* ===================== CENTER ===================== */

    private JPanel createCenter() {
        JPanel center = new JPanel(new GridBagLayout());
        center.setOpaque(false);

        int w = Math.max(
                s(360),
                Math.min((int) (getWidth() * 0.48), (int) (getWidth() * 0.75))
        );

        center.add(createCard(w, s(360)));
        return center;
    }

    private RoundedPanel createCard(int w, int h) {
        RoundedPanel card = new RoundedPanel(s(16), Color.WHITE);
        card.setPreferredSize(new Dimension(w, h));
        card.setLayout(new GridBagLayout());
        card.setBorder(BorderFactory.createEmptyBorder(s(18), s(18), s(18), s(18)));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 0;
        gbc.weightx = 1;

        JLabel title = new JLabel("Acesse sua conta");
        title.setFont(new Font("SansSerif", Font.BOLD, s(18)));
        title.setForeground(new Color(40, 40, 40));

        gbc.gridy = 0;
        gbc.insets = new Insets(s(2), s(4), s(12), s(4));
        card.add(title, gbc);

        HintTextField user = createField("email@exemplo.com", w);
        HintPasswordField pass = createPassField("Senha", w);

        gbc.gridy = 1;
        gbc.insets = new Insets(s(6), s(4), s(6), s(4));
        card.add(UIHelper.wrapWithIcon(user, "user", scale), gbc);

        gbc.gridy = 2;
        card.add(UIHelper.wrapWithIcon(pass, "lock", scale), gbc);

        gbc.gridy = 3;
        gbc.insets = new Insets(s(8), s(4), s(4), s(4));
        card.add(createRememberRow(), gbc);

        gbc.gridy = 4;
        gbc.insets = new Insets(s(10), 0, s(6), 0);
        card.add(new JSeparator(), gbc);

        JLabel status = new JLabel(" ", SwingConstants.CENTER);
        status.setFont(new Font("SansSerif", Font.PLAIN, s(12)));
        status.setForeground(new Color(120, 120, 120));

        gbc.gridy = 5;
        gbc.insets = new Insets(s(8), s(4), s(6), s(4));
        card.add(status, gbc);

        RoundedButton btn = new RoundedButton("Entrar");
        btn.setPreferredSize(new Dimension(w - s(40), s(44)));
        btn.setFont(new Font("SansSerif", Font.BOLD, s(14)));

        gbc.gridy = 6;
        gbc.insets = new Insets(s(6), s(4), s(4), s(4));
        card.add(btn, gbc);

        JLabel footer = new JLabel("DB: " + config.getOrDefault("url", "n/a"));
        footer.setFont(new Font("SansSerif", Font.PLAIN, s(11)));
        footer.setForeground(new Color(130, 130, 130));

        gbc.gridy = 7;
        gbc.insets = new Insets(s(10), s(4), s(4), s(4));
        card.add(footer, gbc);

        setupLogin(user, pass, btn, status);
        return card;
    }

    /* ===================== HELPERS ===================== */

    private HintTextField createField(String hint, int w) {
        HintTextField f = new HintTextField(hint);
        f.setFont(new Font("SansSerif", Font.PLAIN, s(14)));
        f.setPreferredSize(new Dimension(w - s(56), s(40)));
        f.setBackground(new Color(250, 250, 250));
        f.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 220, 220), s(1)),
                BorderFactory.createEmptyBorder(s(8), s(36), s(8), s(12))
        ));
        return f;
    }

    private HintPasswordField createPassField(String hint, int w) {
        HintPasswordField f = new HintPasswordField(hint);
        f.setFont(new Font("SansSerif", Font.PLAIN, s(14)));
        f.setPreferredSize(new Dimension(w - s(56), s(40)));
        f.setBackground(new Color(250, 250, 250));
        f.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(220, 220, 220), s(1)),
                BorderFactory.createEmptyBorder(s(8), s(36), s(8), s(12))
        ));
        return f;
    }

    private JPanel createRememberRow() {
        JPanel row = new JPanel(new BorderLayout());
        row.setOpaque(false);

        JCheckBox remember = new JCheckBox("Lembrar-me");
        remember.setOpaque(false);
        remember.setFont(new Font("SansSerif", Font.PLAIN, s(12)));

        JLabel forgot = new JLabel("Esqueci a senha");
        forgot.setForeground(ACCENT.darker());
        forgot.setFont(new Font("SansSerif", Font.PLAIN, s(12)));
        forgot.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        forgot.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent e) {
                forgot.setText("<html><u>Esqueci a senha</u></html>");
            }
            public void mouseExited(MouseEvent e) {
                forgot.setText("Esqueci a senha");
            }
        });

        row.add(remember, BorderLayout.WEST);
        row.add(forgot, BorderLayout.EAST);
        return row;
    }

    /* ===================== LOGIN ===================== */

    private void setupLogin(HintTextField user, HintPasswordField pass,
                            RoundedButton btn, JLabel status) {

        Runnable login = () -> UIHelper.statusMessage(
                status,
                "Autenticação simulada",
                UIHelper.MessageType.INFO
        );

        btn.addActionListener(e -> login.run());
        user.addActionListener(e -> login.run());
        pass.addActionListener(e -> login.run());

        getRootPane().setDefaultButton(btn);
    }

    private int s(int v) {
        return (int) Math.round(v * scale);
    }
}
