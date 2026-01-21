---
description: Test Agent Kit CLI locally without publishing to npm
---

# Test CLI Locally

Workflow này giúp bạn test CLI locally mà không cần publish lên npm.

## Bước 1: Link CLI globally

Từ thư mục `cli/`, chạy:

```bash
cd cli
npm link
```

Lệnh này sẽ tạo một symlink global cho package `octotech-agent-kit`, cho phép bạn chạy lệnh `agent-kit` từ bất kỳ đâu.

## Bước 2: Test CLI

Tạo một thư mục test mới và chạy CLI:

```bash
mkdir ~/test-agent-kit
cd ~/test-agent-kit
agent-kit
```

Hoặc test với các lệnh cụ thể:

```bash
agent-kit --help
agent-kit init
```

## Bước 3: Sau khi sửa code

Mỗi khi bạn sửa code trong `cli/src/`, thay đổi sẽ **tự động có hiệu lực** ngay lập tức vì `npm link` tạo symlink, không phải copy files.

Bạn chỉ cần chạy lại lệnh test:

```bash
cd ~/test-agent-kit
agent-kit
```

## Bước 4: Unlink khi hoàn thành

Khi không cần test nữa, unlink để cleanup:

```bash
cd cli
npm unlink -g
```

## Tips

### Test với project mới mỗi lần
```bash
rm -rf ~/test-agent-kit
mkdir ~/test-agent-kit
cd ~/test-agent-kit
agent-kit
```

### Xem CLI đang link ở đâu
```bash
which agent-kit
# Output: /usr/local/bin/agent-kit -> ../lib/node_modules/octotech-agent-kit/src/index.js
```

### Debug mode
Thêm `console.log()` vào code để debug, output sẽ hiện ngay khi chạy CLI.

## Lưu ý

- ✅ Không cần rebuild hay recompile
- ✅ Thay đổi code có hiệu lực ngay lập tức
- ✅ Không cần publish lên npm
- ⚠️ Nhớ `npm unlink -g` sau khi test xong
- ⚠️ Nếu thay đổi `package.json` (thêm dependencies), cần chạy `npm install` trong `cli/` trước
