'use client'
import { useState } from 'react';
import React from 'react';
// 定义交互式代码展示组件
const CodeDisplayWithResult: React.FC<{ code: string }> = ({ code }) => {
    const [result, setResult] = useState<string>(''); // 这里是正确的 Hooks 调用
    const [isRunning, setIsRunning] = useState<boolean>(false); // 这里也是正确的 Hooks 调用

    const handleRun = (): void => {
        setIsRunning(true);
        try {
            // 这里可以实现代码运行逻辑，比如在沙箱中运行代码
            // 注意：在实际项目中，直接运行代码可能存在安全风险
            // 这里仅作为示例，实际使用时请确保代码安全
            const func = new Function(code);
            const output = func();
            setResult(`运行结果: ${output}`);
        } catch (error) {
            if (error instanceof Error) {
                setResult(`错误: ${error.message}`);
            } else {
                setResult('发生了未知错误');
            }
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="code-display-with-result">
            <div className="code-preview">
                <h3>代码展示</h3>
                <pre className="code-content">
                    <code>{code}</code>
                </pre>
            </div>
            <div className="code-result">
                <button className="run-button" onClick={handleRun} disabled={isRunning}>
                    {isRunning ? '运行中...' : '运行代码'}
                </button>
                <div className="result" style={{ marginTop: '10px' }}>
                    {result}
                </div>
            </div>
        </div>
    );
};

// 导出组件
export default CodeDisplayWithResult;