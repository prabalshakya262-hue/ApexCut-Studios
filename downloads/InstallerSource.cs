using System;
using System.Drawing;
using System.Windows.Forms;

namespace ApexCutInstaller
{
    public class InstallerForm : Form
    {
        private ProgressBar progressBar;
        private Label statusLabel;
        private Button actionButton;
        private Timer installTimer;
        private int progressValue = 0;

        public InstallerForm()
        {
            this.Text = "ApexCut Video Studio - Setup Wizard";
            this.Size = new Size(540, 380);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(18, 22, 34);
            this.ForeColor = Color.White;

            // Header Banner
            Panel header = new Panel();
            header.Dock = DockStyle.Top;
            header.Height = 85;
            header.BackColor = Color.FromArgb(28, 34, 52);

            Label title = new Label();
            title.Text = "ApexCut Video Studio v2.5.0";
            title.Font = new Font("Segoe UI", 16, FontStyle.Bold);
            title.ForeColor = Color.FromArgb(99, 102, 241);
            title.Location = new Point(24, 18);
            title.AutoSize = true;
            header.Controls.Add(title);

            Label subtitle = new Label();
            subtitle.Text = "Hardware-Accelerated 4K/8K Video Editing Suite for Windows";
            subtitle.Font = new Font("Segoe UI", 9, FontStyle.Regular);
            subtitle.ForeColor = Color.FromArgb(160, 174, 192);
            subtitle.Location = new Point(26, 48);
            subtitle.AutoSize = true;
            header.Controls.Add(subtitle);

            this.Controls.Add(header);

            // Body Info
            Label info = new Label();
            info.Text = "Thank you for downloading ApexCut Video Studio.\n\n" +
                        "Click 'Install Now' to install the application on your computer.\n" +
                        "If you are the developer, you can replace this .exe file in the website's\n" +
                        "'downloads/' folder with your own compiled application binary anytime.";
            info.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            info.ForeColor = Color.FromArgb(226, 232, 240);
            info.Location = new Point(26, 105);
            info.Size = new Size(480, 85);
            this.Controls.Add(info);

            // Status Label
            statusLabel = new Label();
            statusLabel.Text = "Ready to install.";
            statusLabel.Font = new Font("Segoe UI", 9, FontStyle.Italic);
            statusLabel.ForeColor = Color.FromArgb(148, 163, 184);
            statusLabel.Location = new Point(26, 205);
            statusLabel.Size = new Size(480, 20);
            this.Controls.Add(statusLabel);

            // Progress Bar
            progressBar = new ProgressBar();
            progressBar.Location = new Point(26, 230);
            progressBar.Size = new Size(470, 24);
            progressBar.Style = ProgressBarStyle.Continuous;
            this.Controls.Add(progressBar);

            // Action Button
            actionButton = new Button();
            actionButton.Text = "Install Now";
            actionButton.Font = new Font("Segoe UI", 10, FontStyle.Bold);
            actionButton.BackColor = Color.FromArgb(99, 102, 241);
            actionButton.ForeColor = Color.White;
            actionButton.FlatStyle = FlatStyle.Flat;
            actionButton.FlatAppearance.BorderSize = 0;
            actionButton.Location = new Point(360, 280);
            actionButton.Size = new Size(136, 38);
            actionButton.Cursor = Cursors.Hand;
            actionButton.Click += ActionButton_Click;
            this.Controls.Add(actionButton);

            installTimer = new Timer();
            installTimer.Interval = 40;
            installTimer.Tick += InstallTimer_Tick;
        }

        private void ActionButton_Click(object sender, EventArgs e)
        {
            if (actionButton.Text == "Install Now")
            {
                actionButton.Enabled = false;
                statusLabel.Text = "Extracting runtime binaries & GPU codecs...";
                installTimer.Start();
            }
            else if (actionButton.Text == "Finish")
            {
                this.Close();
            }
        }

        private void InstallTimer_Tick(object sender, EventArgs e)
        {
            progressValue += 2;
            if (progressValue <= 100)
            {
                progressBar.Value = progressValue;
                if (progressValue == 30) statusLabel.Text = "Registering Direct3D & Vulkan video engines...";
                if (progressValue == 65) statusLabel.Text = "Installing default LUTs and audio plugins...";
                if (progressValue == 90) statusLabel.Text = "Finalizing configuration and desktop shortcuts...";
            }
            else
            {
                installTimer.Stop();
                statusLabel.Text = "Installation complete! ApexCut Studio is ready to use.";
                statusLabel.ForeColor = Color.FromArgb(16, 185, 129);
                actionButton.Text = "Finish";
                actionButton.BackColor = Color.FromArgb(16, 185, 129);
                actionButton.Enabled = true;
            }
        }

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }
    }
}
