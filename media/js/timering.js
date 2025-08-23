// 当DOM内容加载完成时，初始化一个新的ProgressClock实例
window.addEventListener("DOMContentLoaded", () => {
    const clock = new ProgressClock("#clock");
});

// 定义一个名为ProgressClock的类
class ProgressClock {
    constructor(qs) {
        // 初始化类属性
        this.el = document.querySelector(qs); // 根据提供的查询选择器选择时钟元素
        this.time = 0; // 初始化时间属性
        this.updateTimeout = null; // 初始化更新超时属性
        this.ringTimeouts = []; // 初始化环超时属性
        this.update(); // 调用update方法开始更新时钟
    }

    // 获取星期几的缩写名称的方法
    getDayOfWeek(day) {
        switch (day) {
            case 1:
                return "一";
            case 2:
                return "二";
            case 3:
                return "三";
            case 4:
                return "四";
            case 5:
                return "五";
            case 6:
                return "六";
            default:
                return "日";
        }
    }

    // 获取月份信息的方法
    getMonthInfo(mo, yr) {
        switch (mo) {
            case 1:
                return { name: "二月", days: yr % 4 === 0 ? 29 : 28 };
            case 2:
                return { name: "三月", days: 31 };
            case 3:
                return { name: "四月", days: 30 };
            case 4:
                return { name: "五月", days: 31 };
            case 5:
                return { name: "六月", days: 30 };
            case 6:
                return { name: "七月", days: 31 };
            case 7:
                return { name: "八月", days: 31 };
            case 8:
                return { name: "九月", days: 30 };
            case 9:
                return { name: "十月", days: 31 };
            case 10:
                return { name: "十一月", days: 30 };
            case 11:
                return { name: "十二月", days: 31 };
            default:
                return { name: "一月", days: 31 };
        }
    }

    // 更新时钟显示的方法
    update() {
        this.time = new Date(); // 获取当前时间

        if (this.el) {
            // 获取日期和时间组件
            const dayOfWeek = this.time.getDay();
            const year = this.time.getFullYear();
            const month = this.time.getMonth();
            const day = this.time.getDate();
            const hr = this.time.getHours();
            const min = this.time.getMinutes();
            const sec = this.time.getSeconds();
            const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
            const monthInfo = this.getMonthInfo(month, year);
            const m_progress = sec / 60; // 当前分钟的进度
            const h_progress = (min + m_progress) / 60; // 当前小时的进度
            const d_progress = (hr + h_progress) / 24; // 当前日的进度
            const mo_progress = ((day - 1) + d_progress) / monthInfo.days; // 当前月的进度
            const units = [
                { label: "w", value: dayOfWeekName }, // 星期几
                { label: "mo", value: monthInfo.name, progress: mo_progress }, // 月份
                { label: "d", value: day, progress: d_progress }, // 日期
                { label: "h", value: hr < 10 ? "0" + hr : hr, progress: h_progress }, // 小时
                { label: "m", value: min < 10 ? "0" + min : min, progress: m_progress }, // 分钟
                { label: "s", value: sec < 10 ? "0" + sec : sec }, // 秒
                { label: "ap", value: hr > 12 ? "下午" : "上午" } // 上午/下午
            ];

            // 清除之前的超时
            this.ringTimeouts.forEach(t => {
                clearTimeout(t);
            });
            this.ringTimeouts = [];

            // 更新显示
            units.forEach(u => {
                // 环
                const ring = this.el.querySelector(`[data-ring="${u.label}"]`);

                if (ring) {
                    const strokeDashArray = ring.getAttribute("stroke-dasharray");
                    const fill360 = "progress-clock__ring-fill--360";

                    if (strokeDashArray) {
                        // 计算描边
                        const circumference = +strokeDashArray.split(" ")[0];
                        const strokeDashOffsetPct = 1 - u.progress;

                        ring.setAttribute(
                            "stroke-dashoffset",
                            strokeDashOffsetPct * circumference
                        );

                        // 添加淡出过渡效果，然后移除它
                        if (strokeDashOffsetPct === 1) {
                            ring.classList.add(fill360);

                            this.ringTimeouts.push(
                                setTimeout(() => {
                                    ring.classList.remove(fill360);
                                }, 600)
                            );
                        }
                    }
                }

                // 数字
                const unit = this.el.querySelector(`[data-unit="${u.label}"]`);

                if (unit)
                    unit.innerText = u.value;
            });
        }

        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(this.update.bind(this), 1000); // 每秒更新一次
    }
}
