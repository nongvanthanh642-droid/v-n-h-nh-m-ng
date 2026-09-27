package com.jdcloud.ax1800.ui;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.jdcloud.ax1800.R;
import com.jdcloud.ax1800.ssh.RouterCommands;
import com.jdcloud.ax1800.ssh.SshManager;

/**
 * Giao diện chính của App APK:
 * - Nút bấm Khóa BTS, Copy NekoBox, Chặn TikTok, Bóp băng thông.
 * - Khung hiển thị Feedback STDOUT trả về từ Router theo thời gian thực.
 */
public class MainActivity extends AppCompatActivity {

    private TextView tvStatus, tvConsoleOutput;
    private EditText etEarfcn, etPci;
    private Switch switchGameVpn, switchAiUs;
    private ProgressBar progressBar;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Khởi tạo Views
        tvStatus = findViewById(R.id.tvStatus);
        tvConsoleOutput = findViewById(R.id.tvConsoleOutput);
        etEarfcn = findViewById(R.id.etEarfcn);
        etPci = findViewById(R.id.etPci);
        switchGameVpn = findViewById(R.id.switchGameVpn);
        switchAiUs = findViewById(R.id.switchAiUs);
        progressBar = findViewById(R.id.progressBar);

        // Tự động kết nối SSH ngầm khi mở app
        connectToRouter();

        // 1. Nút Khóa Trạm BTS
        findViewById(R.id.btnLockBts).setOnClickListener(v -> {
            try {
                int earfcn = Integer.parseInt(etEarfcn.getText().toString().trim());
                int pci = Integer.parseInt(etPci.getText().toString().trim());
                runRouterCommand("Khóa Trạm BTS (Cell Lock)", RouterCommands.lockBtsCell(earfcn, pci));
            } catch (Exception e) {
                Toast.makeText(this, "Vui lòng nhập đúng EARFCN và PCI", Toast.LENGTH_SHORT).show();
            }
        });

        // 2. Nút Đọc Thông Số Sóng 4G
        findViewById(R.id.btnCheckSignal).setOnClickListener(v -> {
            runRouterCommand("Kiểm Tra Sóng 4G", RouterCommands.getSignalInfo());
        });

        // 3. Nút Chép Đè File Config NekoBox
        findViewById(R.id.btnReloadNeko).setOnClickListener(v -> {
            runRouterCommand("Chép File & Reload NekoBox", RouterCommands.reloadNekoConfig());
        });

        // 4. Nút Chặn TikTok Toàn Mạng
        findViewById(R.id.btnBlockTiktok).setOnClickListener(v -> {
            runRouterCommand("Chặn Gói Tin TikTok", RouterCommands.blockTikTok(true));
        });

        // 5. Nút Mở Lại TikTok
        findViewById(R.id.btnUnblockTiktok).setOnClickListener(v -> {
            runRouterCommand("Mở Lại TikTok", RouterCommands.blockTikTok(false));
        });

        // 6. Gạt Switch Phân Luồng Game Sang Singapore
        switchGameVpn.setOnCheckedChangeListener((buttonView, isChecked) -> {
            runRouterCommand("Định Tuyến Game Singapore", RouterCommands.setGameRouting(isChecked));
        });

        // 7. Gạt Switch AI Đi Qua Node Mỹ
        switchAiUs.setOnCheckedChangeListener((buttonView, isChecked) -> {
            runRouterCommand("Định Tuyến AI (Mỹ)", RouterCommands.setAiRouting(isChecked));
        });

        // 8. Nút Kiểm Tra 64GB eMMC
        findViewById(R.id.btnCheckEmmc).setOnClickListener(v -> {
            runRouterCommand("Kiểm Tra Ổ Cứng 64GB eMMC", RouterCommands.checkEmmcSpace());
        });
    }

    private void connectToRouter() {
        tvStatus.setText("Đang kết nối SSH (192.168.1.1:22)...");
        progressBar.setVisibility(View.VISIBLE);

        SshManager.getInstance().connect(new SshManager.SshCallback() {
            @Override
            public void onSuccess(String output, int exitCode) {
                mainHandler.post(() -> {
                    progressBar.setVisibility(View.GONE);
                    tvStatus.setText("ĐÃ KẾT NỐI ROUTER (Port 22 SSH)");
                    tvStatus.setTextColor(0xFF10B981); // Xanh lá
                    tvConsoleOutput.setText(output);
                });
            }

            @Override
            public void onError(String error) {
                mainHandler.post(() -> {
                    progressBar.setVisibility(View.GONE);
                    tvStatus.setText("MẤT KẾT NỐI SSH");
                    tvStatus.setTextColor(0xFFEF4444); // Đỏ
                    tvConsoleOutput.setText(error);
                });
            }
        });
    }

    private void runRouterCommand(String title, String cmd) {
        progressBar.setVisibility(View.VISIBLE);
        tvConsoleOutput.setText("Đang gửi lệnh: " + cmd + "\n...");

        SshManager.getInstance().executeCommand(cmd, new SshManager.SshCallback() {
            @Override
            public void onSuccess(String output, int exitCode) {
                mainHandler.post(() -> {
                    progressBar.setVisibility(View.GONE);
                    tvConsoleOutput.setText("=== THÀNH CÔNG: " + title + " ===\n" + output);
                    Toast.makeText(MainActivity.this, title + ": THÀNH CÔNG!", Toast.LENGTH_SHORT).show();
                });
            }

            @Override
            public void onError(String error) {
                mainHandler.post(() -> {
                    progressBar.setVisibility(View.GONE);
                    tvConsoleOutput.setText("=== THẤT BẠI: " + title + " ===\n" + error);
                    Toast.makeText(MainActivity.this, title + ": LỖI!", Toast.LENGTH_LONG).show();
                });
            }
        });
    }
}
