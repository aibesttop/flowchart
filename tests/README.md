# 测试文档

## 测试结构

本项目采用全面的白盒测试策略，包括：

### 1. 单元测试 (Unit Tests)

#### Stores 测试
- **diagram.test.ts**: 测试图表状态管理
  - 初始化默认值
  - 更新图表代码
  - 更新图表标题
  - 设置图表ID
  - 完整状态替换

- **templates.test.ts**: 测试模板系统
  - 模板数量验证
  - 各类型模板存在性检查
  - 模板属性完整性验证
  - ID唯一性检查
  - Mermaid语法有效性验证

#### Utils 测试
- **export.test.ts**: 测试导出功能
  - PNG导出功能
  - SVG导出功能
  - PDF导出功能
  - 错误处理
  - 文件名处理

#### 组件测试
- **TemplatePanel.test.ts**: 测试模板选择面板
  - 渲染逻辑
  - 模板选择
  - 关闭功能
  - 状态更新

- **Toolbar.test.ts**: 测试工具栏
  - 标题编辑
  - 保存功能
  - 分享功能
  - 导出菜单
  - 模板打开

### 2. 集成测试 (Integration Tests)

#### 图表工作流测试
- **diagram-workflow.test.ts**: 测试完整的用户工作流
  - 创建图表流程
  - 模板选择和切换
  - 编辑和保存
  - 加载和更新
  - 分享链接生成

#### LocalStorage 集成测试
- **localStorage.test.ts**: 测试数据持久化
  - 保存和检索
  - 多图表管理
  - 更新操作
  - 空状态处理

## 测试覆盖范围

### 核心功能覆盖
- ✅ 状态管理 (Svelte Stores)
- ✅ 模板系统
- ✅ 导出功能 (PNG/SVG/PDF)
- ✅ 本地存储
- ✅ 分享功能
- ✅ UI组件交互

### 边界情况测试
- ✅ 空状态处理
- ✅ 错误处理
- ✅ 无效输入验证
- ✅ 缺失数据处理

## 运行测试

```bash
# 运行所有测试
npm test

# 监视模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 使用UI界面运行测试
npm run test:ui
```

## 测试技术栈

- **Vitest**: 测试框架
- **@testing-library/svelte**: Svelte组件测试工具
- **@testing-library/jest-dom**: DOM断言扩展
- **jsdom**: 浏览器环境模拟
- **@vitest/coverage-v8**: 代码覆盖率工具

## Mock 策略

### 外部依赖 Mock
- `html2canvas`: 用于PNG/PDF导出
- `jsPDF`: 用于PDF生成
- `monaco-editor`: 代码编辑器（在组件测试中）
- `mermaid`: 图表渲染引擎（在组件测试中）

### 浏览器 API Mock
- `localStorage`: 数据持久化
- `navigator.clipboard`: 剪贴板操作
- `window.alert`: 用户提示
- `URL.createObjectURL`: Blob URL生成

## 测试最佳实践

1. **隔离性**: 每个测试独立运行，使用 `beforeEach` 重置状态
2. **可读性**: 使用描述性的测试名称
3. **完整性**: 测试正常流程和异常流程
4. **真实性**: 尽可能模拟真实用户行为
5. **维护性**: 保持测试代码简洁清晰

## 覆盖率目标

- **语句覆盖率**: > 80%
- **分支覆盖率**: > 75%
- **函数覆盖率**: > 80%
- **行覆盖率**: > 80%

## 持续改进

测试套件会随着功能开发持续更新。未来计划：
- E2E测试（使用Playwright）
- 性能测试
- 可访问性测试
- 视觉回归测试
