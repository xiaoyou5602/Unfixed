// 由 tools/qbank.py build 生成，不要手改；内容和 generated/questions.json 相同
window.QUESTION_BANK = {
  "_说明": "本文件由 tools/qbank.py 从 06-item-blueprint.md 与 06-items/ 生成，不要手工修改。改题请改 06-items/ 里的分册，再运行 python3 tools/qbank.py build。",
  "source": [
    "06-item-blueprint.md",
    "06-items/1-opening-romantic.md",
    "06-items/2-sexual.md",
    "06-items/3-other-attraction.md",
    "06-items/4-relationship.md",
    "06-items/5-structure.md"
  ],
  "condition_ops": {
    "=": "单选题选了这一项",
    "≠": "出现了但没选这一项",
    "∈": "选了其中任一项",
    "∉": "出现了但没选其中任何一项",
    "含": "多选题选了其中任一项",
    "不含": "多选题出现了但没选这一项",
    "出现": "这道题出现过",
    "未出现": "这道题没有出现过",
    "row": "逐行题的行名或轴号；写轴号时，属于这条轴的行有一行符合即成立",
    "note": "题目没有出现时，除\"未出现\"外的条件一律不成立；跳过、不确定、没有这类经历也是可比较的取值；出现了却什么都没选的题按跳过算；逐行题一行都不出现时整题不出"
  },
  "parts": [
    {
      "id": "Q0",
      "title": "开场",
      "section": "14.4",
      "intro": [
        {
          "text": "这个测试用于帮助你寻找适合描述自己的语言。 \n问题没有标准答案，按照自己的感受选就好，每道题都可以跳过，无法确定的选项可以选择\"我不确定\"。",
          "show_if": null
        }
      ],
      "cover": [
        {
          "when": "plain",
          "text": "题目会按你前面的回答出现，大约 35~48题。回答只保存在这台设备的浏览器里。答完会拼出一本你的探索手册。"
        }
      ]
    },
    {
      "id": "Q1",
      "title": "维度一 · 浪漫",
      "section": "14.5",
      "intro": [
        {
          "text": "这一部分是关于浪漫方面的感受。",
          "show_if": null
        },
        {
          "text": "你之前选择了不区分浪漫吸引和性吸引。接下来的问题，你可以按照自己对吸引的整体体验来回答。",
          "show_if": {
            "source": "Q0-02 = 不拆分",
            "rule": {
              "question": "Q0-02",
              "op": "=",
              "values": [
                "不拆分"
              ]
            }
          }
        }
      ]
    },
    {
      "id": "Q2",
      "title": "维度二 · 性",
      "section": "14.6",
      "intro": [
        {
          "text": "这一部分聊聊性方面的吸引。下面说的“这种渴望”，指你想和某个特定的人（或角色）有性接触的愿望；真实的人和虚构角色都算。",
          "show_if": {
            "source": "Q0-02 ≠ 不拆分",
            "rule": {
              "question": "Q0-02",
              "op": "≠",
              "values": [
                "不拆分"
              ]
            }
          }
        },
        {
          "text": "你在开头选了浪漫和性分不开，所以这里不再把吸引拆成两种来问。接下来只聊性欲、你对性方面亲密的感受，以及你想不想要这样的关系。",
          "show_if": {
            "source": "Q0-02 = 不拆分",
            "rule": {
              "question": "Q0-02",
              "op": "=",
              "values": [
                "不拆分"
              ]
            }
          }
        }
      ]
    },
    {
      "id": "Q3",
      "title": "维度三 · 其他吸引",
      "section": "14.7",
      "intro": [
        {
          "text": "接下来聊聊另外几种感受：你会想和谁做朋友、拥抱谁、欣赏谁，或者想和谁建立更深的联系。这些感受都可以同时存在。",
          "show_if": null
        }
      ]
    },
    {
      "id": "QM",
      "title": "方向模块",
      "section": "14.8",
      "intro": []
    },
    {
      "id": "Q4",
      "title": "维度四 · 关系偏好",
      "section": "14.9",
      "intro": [
        {
          "text": "接下来聊聊你想和别人建立怎样的关系。按自己理想中的情况来选，不用考虑眼下有没有这样的关系、能不能实现。",
          "show_if": null
        }
      ]
    },
    {
      "id": "Q5",
      "title": "维度五 · 结构与理念",
      "section": "14.10",
      "intro": []
    }
  ],
  "questions": [
    {
      "id": "Q0-02",
      "title": "是否拆分",
      "part": "Q0",
      "measures": "作答方式（第 5 节）",
      "enabled_by_default": true,
      "response": "单选",
      "stem": "对你来讲，浪漫吸引和性吸引是两种不同的感受吗？",
      "note": "这个选项只会影响到后面题的问法，不决定结果",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "拆分#1",
          "text": "是的，我觉得这是两种不同的感受",
          "value": "拆分",
          "free_text": false
        },
        {
          "id": "不拆分",
          "text": "对我来说，它们混在一起，我很难分清哪种是浪漫吸引，哪种是性吸引",
          "value": "不拆分",
          "free_text": false
        },
        {
          "id": "拆分#2",
          "text": "我可以理解它们的区别，但这对我来说没什么实际意义",
          "value": "拆分",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-01",
      "title": "成分",
      "part": "Q1",
      "measures": "1A 的成分（3.1）",
      "enabled_by_default": true,
      "distinguishes": [
        1,
        4,
        47
      ],
      "response": "多选",
      "stem": "你有没有对某个特定的人（或角色）有过比较强烈的在意？如果有，回想一下那时的感受，下面哪些描述符合？可以多选。",
      "exclusive": [
        "都对不上",
        "没有强烈在意"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "成为一对",
          "text": "我希望我们之间的关系是彼此专属的",
          "value": "成为一对",
          "free_text": false
        },
        {
          "id": "恋爱方向",
          "text": "我希望我们的关系一步步往前走，比如约会、表白、正式交往",
          "value": "恋爱方向",
          "free_text": false
        },
        {
          "id": "心动",
          "text": "我会特别惦记对方，比如总想着对方、见面会紧张、很在意对方怎么看我",
          "value": "心动",
          "free_text": false
        },
        {
          "id": "恋人互动",
          "text": "我想和对方有亲昵的互动，比如说甜蜜的话、用专属的称呼叫对方",
          "value": "恋人互动",
          "free_text": false
        },
        {
          "id": "身体反应",
          "text": "想到或见到对方时，我身体会有反应，比如心跳加快、脸红",
          "value": "身体反应",
          "free_text": false
        },
        {
          "id": "都对不上",
          "text": "这些描述都对不上我",
          "value": "都对不上",
          "free_text": false
        },
        {
          "id": "没有强烈在意",
          "text": "我没有过这样强烈的在意",
          "value": "没有强烈在意",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-04",
      "title": "分类方式",
      "part": "Q1",
      "measures": "轴 ①",
      "enabled_by_default": true,
      "distinguishes": [
        1,
        2,
        9,
        40,
        41,
        49
      ],
      "response": "单选",
      "stem": "当谈论到\"恋爱式的喜欢\"与\"朋友式的喜欢\"时，哪句最接近你？",
      "note": "只要你理解两者的区别，不管自己有没有过恋爱式的喜欢，都算分得清。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "清楚",
          "text": "我当然能够分清这两种喜欢的区别",
          "value": "清楚",
          "free_text": false
        },
        {
          "id": "有点模糊",
          "text": "我大多分得清，只是偶尔有些模糊",
          "value": "有点模糊",
          "free_text": false
        },
        {
          "id": "体验相同",
          "text": "对我来说两种感受没什么区别，只看对方是谁",
          "value": "体验相同",
          "free_text": false
        },
        {
          "id": "无法区分",
          "text": "两种感受对我而言没什么区别，我没办法做区分",
          "value": "无法区分",
          "free_text": false
        },
        {
          "id": "无法理解",
          "text": "我不理解恋爱式的喜欢到底是什么感受，所以也不能判断自己有没有",
          "value": "无法理解",
          "free_text": false
        },
        {
          "id": "不适用",
          "text": "我明白区别，但是我觉得这些词汇都不适用于我",
          "value": "不适用",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-21",
      "title": "对自身感受的判断",
      "part": "Q1",
      "measures": "能否辨认自己经历过的浪漫吸引",
      "enabled_by_default": true,
      "distinguishes": [
        8,
        9
      ],
      "response": "单选",
      "stem": "回想你对某个人（也可以是虚构角色）产生过的喜欢或在意。你觉得其中有属于「恋爱式喜欢」的吗？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "确定有过",
          "text": "我能确定有过，也分得清哪些算",
          "value": "确定有过",
          "free_text": false
        },
        {
          "id": "拿不准算不算",
          "text": "我有过一些感受，但不知道它们算不算",
          "value": "拿不准算不算",
          "free_text": false
        },
        {
          "id": "确定没有过",
          "text": "我能确定自己从来没有过",
          "value": "确定没有过",
          "free_text": false
        },
        {
          "id": "不必区分",
          "text": "我觉得没必要把这些感受分成恋爱式和其他类型",
          "value": "不必区分",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-02",
      "title": "频率",
      "part": "Q1",
      "measures": "轴 ②",
      "show_if": {
        "source": "Q1-21 ∉ {确定没有过、不必区分}",
        "rule": {
          "question": "Q1-21",
          "op": "∉",
          "values": [
            "确定没有过",
            "不必区分"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        7,
        8,
        9,
        21,
        36
      ],
      "response": "单选",
      "stem": "你对某个人（或角色）产生「恋爱式喜欢」的频率是多少？",
      "note": "如果有些感受你还拿不准，这里先按你能确定的部分回答。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "很少",
          "text": "有过，但很少",
          "value": "很少",
          "free_text": false
        },
        {
          "id": "经常",
          "text": "经常会有",
          "value": "经常",
          "free_text": false
        },
        {
          "id": "说不清",
          "text": "我说不清有没有",
          "value": "说不清",
          "free_text": false
        },
        {
          "id": "从不",
          "text": "我确定从来没有过",
          "value": "从不",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-03",
      "title": "强度",
      "part": "Q1",
      "measures": "轴 ②",
      "show_if": {
        "source": "Q1-02 ≠ 从不",
        "rule": {
          "question": "Q1-02",
          "op": "≠",
          "values": [
            "从不"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        8,
        9,
        15
      ],
      "response": "单选",
      "stem": "有这种感受的时候，通常有多强？",
      "note": "每次不一样的话，按大多数时候来选。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "很弱",
          "text": "很淡，有时几乎察觉不到",
          "value": "很弱",
          "free_text": false
        },
        {
          "id": "中等",
          "text": "能感觉到，但不算强烈",
          "value": "中等",
          "free_text": false
        },
        {
          "id": "强烈",
          "text": "很明显，有时很强烈",
          "value": "强烈",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-05",
      "title": "无浪漫光谱归属",
      "part": "Q1",
      "measures": "光谱归属（9.2）",
      "show_if": {
        "source": "Q1-04 ∈ {体验相同、无法区分、无法理解、不适用}",
        "rule": {
          "question": "Q1-04",
          "op": "∈",
          "values": [
            "体验相同",
            "无法区分",
            "无法理解",
            "不适用"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        40,
        41
      ],
      "response": "单选",
      "stem": "下面是\"无浪漫光谱\"（aro-spec）的定义。读完后，你会把自己放在这个范围里吗？",
      "definitions": [
        {
          "term": "Aro-spec",
          "section": "3.4",
          "text": "很少或不体验浪漫吸引、以有条件或非典型方式体验、与\"浪漫吸引\"这个概念关系复杂，或体验与社会对\"浪漫爱\"的主流期待不一致的人"
        }
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "在光谱内",
          "text": "我会把自己放在里面",
          "value": "在光谱内",
          "free_text": false
        },
        {
          "id": "不在光谱内",
          "text": "我不会把自己放在里面",
          "value": "不在光谱内",
          "free_text": false
        },
        {
          "id": "不想归类",
          "text": "我不想给自己归类",
          "value": "不想归类",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-06",
      "title": "成分与契合感",
      "part": "Q1",
      "measures": "轴 ⑨",
      "show_if": {
        "source": "(Q1-01 含 {成为一对、恋爱方向、心动、恋人互动、身体反应} 且 (Q1-02 = 从不 或 Q1-21 = 确定没有过)) 或 Q1-04 ∈ {有点模糊、体验相同、无法区分} 或 Q1-21 = 拿不准算不算 或 Q1-02 = 很少 或 Q1-03 = 很弱",
        "rule": {
          "any": [
            {
              "all": [
                {
                  "question": "Q1-01",
                  "op": "含",
                  "values": [
                    "成为一对",
                    "恋爱方向",
                    "心动",
                    "恋人互动",
                    "身体反应"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q1-02",
                      "op": "=",
                      "values": [
                        "从不"
                      ]
                    },
                    {
                      "question": "Q1-21",
                      "op": "=",
                      "values": [
                        "确定没有过"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "question": "Q1-04",
              "op": "∈",
              "values": [
                "有点模糊",
                "体验相同",
                "无法区分"
              ]
            },
            {
              "question": "Q1-21",
              "op": "=",
              "values": [
                "拿不准算不算"
              ]
            },
            {
              "question": "Q1-02",
              "op": "=",
              "values": [
                "很少"
              ]
            },
            {
              "question": "Q1-03",
              "op": "=",
              "values": [
                "很弱"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        47,
        48,
        49
      ],
      "response": "多选",
      "stem": "关于对别人的这类在意，下面的描述有没有符合你的？可以多选或者跳过。",
      "exclusive": [
        "都不像"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "morpho",
          "text": "我会有看起来像喜欢上一个人的反应或举动，但我不觉得自己感受到了同等程度的吸引",
          "value": "morpho",
          "free_text": false
        },
        {
          "id": "pseudo·模仿",
          "text": "我觉得它更像别的吸引，比如想和对方亲近、欣赏对方",
          "value": "pseudo·模仿",
          "free_text": false
        },
        {
          "id": "pseudo·遮盖",
          "text": "我会被一个人的外表或其他方面强烈吸引，比如觉得对方特别好看、特别聪明，让我分不清自己到底有没有恋爱意义上的心动",
          "value": "pseudo·遮盖",
          "free_text": false
        },
        {
          "id": "acri",
          "text": "我有这种感受，但它让我觉得别扭，和我对自己的认识对不上",
          "value": "acri",
          "free_text": false
        },
        {
          "id": "都不像",
          "text": "这些都不像我",
          "value": "都不像",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-07",
      "title": "前提",
      "part": "Q1",
      "measures": "轴 ③",
      "enabled_by_default": true,
      "distinguishes": [
        10,
        11,
        42,
        43
      ],
      "response": "多选",
      "stem": "这种对他人的在意感通常会在什么情况下出现？可以多选。",
      "note": "很少有或几乎没有过的话，按记得的那几次来选；一次都没有过，选\"没有这类经历\"。",
      "exclusive": [
        "无特定条件"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        },
        {
          "value": "没有这类经历",
          "text": "我没有这类经历",
          "handling": "记为信息不足，有线索的子类按 12.1 列为\"可能\"；结果页不写参与者缺什么（第 11 节）"
        }
      ],
      "options": [
        {
          "id": "无特定条件",
          "text": "我不需要特别的前提就会有这种感受",
          "value": "无特定条件",
          "free_text": false
        },
        {
          "id": "demi",
          "text": "我需要先和对方建立很深的情感连接才会有这种感受",
          "value": "demi",
          "free_text": false
        },
        {
          "id": "recip",
          "text": "只有知道对方也对我有好感，我才可能对对方产生这种感受",
          "value": "recip",
          "free_text": false
        },
        {
          "id": "apres",
          "text": "我得先对一个人产生其他方面的好感，比如觉得对方好看、想和对方做朋友",
          "value": "apres",
          "free_text": false
        },
        {
          "id": "fray",
          "text": "我只在和对方还不熟的时候会有",
          "value": "fray",
          "free_text": false
        },
        {
          "id": "coeo",
          "text": "如果刚认识对方时没有这种感受，我之后也不会再有",
          "value": "coeo",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-08",
      "title": "对不熟的人",
      "part": "Q1",
      "measures": "轴 ③（复核 demi、recip）",
      "show_if": {
        "source": "Q1-07 含 demi 或 Q1-07 含 recip 或 (Q1-07 含 没有这类经历 且 (Q1-02 ≠ 从不 或 Q1-21 = 不必区分))",
        "rule": {
          "any": [
            {
              "question": "Q1-07",
              "op": "含",
              "values": [
                "demi"
              ]
            },
            {
              "question": "Q1-07",
              "op": "含",
              "values": [
                "recip"
              ]
            },
            {
              "all": [
                {
                  "question": "Q1-07",
                  "op": "含",
                  "values": [
                    "没有这类经历"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q1-02",
                      "op": "≠",
                      "values": [
                        "从不"
                      ]
                    },
                    {
                      "question": "Q1-21",
                      "op": "=",
                      "values": [
                        "不必区分"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        10,
        11
      ],
      "response": "单选",
      "stem": "对完全不熟悉或者刚认识的人，你有过这种感受吗？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "有过·会想进一步",
          "text": "我有过，也会想进一步",
          "value": "有过·会想进一步",
          "free_text": false
        },
        {
          "id": "有过·熟了才发展",
          "text": "我有过，但要熟了才愿意发展",
          "value": "有过·熟了才发展",
          "free_text": false
        },
        {
          "id": "不熟时不会有",
          "text": "我在不熟的时候从来不会有",
          "value": "不熟时不会有",
          "free_text": false
        },
        {
          "id": "recip",
          "text": "我得知道对方对我有意，才会有这种感受",
          "value": "recip",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-09",
      "title": "阶段变化",
      "part": "Q1",
      "measures": "轴 ②（能否加深）③④",
      "show_if": {
        "source": "Q1-02 ≠ 从不 或 Q1-21 = 不必区分",
        "rule": {
          "any": [
            {
              "question": "Q1-02",
              "op": "≠",
              "values": [
                "从不"
              ]
            },
            {
              "question": "Q1-21",
              "op": "=",
              "values": [
                "不必区分"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        12,
        13,
        14,
        44,
        50
      ],
      "response": "多选",
      "stem": "随着你和对方变熟、知道对方的心意，或者在一起之后，这种感受会不会跟着变化？可以多选。",
      "exclusive": [
        "没有特别变化"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        },
        {
          "value": "没有这类经历",
          "text": "我没有这类经历",
          "handling": "记为信息不足，有线索的子类按 12.1 列为\"可能\"；结果页不写参与者缺什么（第 11 节）"
        }
      ],
      "options": [
        {
          "id": "fray",
          "text": "我和对方越熟悉，这种感受就越淡",
          "value": "fray",
          "free_text": false
        },
        {
          "id": "akoi·回应后消退",
          "text": "在我知道对方也喜欢我、或者感受被回应之后，它淡了或消失了",
          "value": "akoi·回应后消退",
          "free_text": false
        },
        {
          "id": "akoi·进入关系后消退",
          "text": "在一起之后，我就会逐渐对这段关系失去了兴趣",
          "value": "akoi·进入关系后消退",
          "free_text": false
        },
        {
          "id": "停在喜欢",
          "text": "这种感受会停在某个程度，比如停在\"喜欢\"，不会再发展下去",
          "value": "停在喜欢",
          "free_text": false
        },
        {
          "id": "没有特别变化",
          "text": "会随着关系越来越接近而自然加深",
          "value": "没有特别变化",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-10",
      "title": "对回应的期待",
      "part": "Q1",
      "measures": "轴 ④",
      "show_if": {
        "source": "Q1-02 ≠ 从不 或 Q1-21 = 不必区分",
        "rule": {
          "any": [
            {
              "question": "Q1-02",
              "op": "≠",
              "values": [
                "从不"
              ]
            },
            {
              "question": "Q1-21",
              "op": "=",
              "values": [
                "不必区分"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        7,
        12,
        14,
        44,
        50
      ],
      "response": "单选",
      "stem": "有这种感受时，你希望对方怎样？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "希望相互",
          "text": "我希望这份感受是相互的",
          "value": "希望相互",
          "free_text": false
        },
        {
          "id": "无所谓",
          "text": "我都无所谓，都可以",
          "value": "无所谓",
          "free_text": false
        },
        {
          "id": "akoi·不需要回应",
          "text": "满足于现状，我不需要对方的回应",
          "value": "akoi·不需要回应",
          "free_text": false
        },
        {
          "id": "akoi·不希望被回应",
          "text": "我希望对方千万不要回应",
          "value": "akoi·不希望被回应",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-11",
      "title": "被喜欢",
      "part": "Q1",
      "measures": "轴 ④",
      "show_if": {
        "source": "Q1-02 ≠ 经常 或 Q1-03 = 很弱 或 Q1-02 未出现",
        "rule": {
          "any": [
            {
              "question": "Q1-02",
              "op": "≠",
              "values": [
                "经常"
              ]
            },
            {
              "question": "Q1-03",
              "op": "=",
              "values": [
                "很弱"
              ]
            },
            {
              "question": "Q1-02",
              "op": "未出现"
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        46,
        50
      ],
      "response": "单选",
      "stem": "你会希望别人对你有恋爱式的喜欢吗？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "希望且回应",
          "text": "我希望被这样喜欢，并且我也会用同样的感受回应",
          "value": "希望且回应",
          "free_text": false
        },
        {
          "id": "disakoi",
          "text": "我希望被这样喜欢，但我没法对 ta 产生同样的感情",
          "value": "disakoi",
          "free_text": false
        },
        {
          "id": "无所谓",
          "text": "我无所谓",
          "value": "无所谓",
          "free_text": false
        },
        {
          "id": "不希望",
          "text": "我不希望",
          "value": "不希望",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-12",
      "title": "指向谁",
      "part": "Q1",
      "measures": "轴 ⑦",
      "show_if": {
        "source": "Q1-02 ≠ 从不 或 Q1-21 = 不必区分",
        "rule": {
          "any": [
            {
              "question": "Q1-02",
              "op": "≠",
              "values": [
                "从不"
              ]
            },
            {
              "question": "Q1-21",
              "op": "=",
              "values": [
                "不必区分"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        17,
        44,
        45
      ],
      "response": "多选",
      "stem": "你的恋爱式喜欢通常会出现在什么样的对象或情境中？可以多选。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "现实可及",
          "text": "指向那些现实中有可能和我建立关系的人",
          "value": "现实可及",
          "free_text": false
        },
        {
          "id": "procul",
          "text": "它主要或只指向我明知不可能建立现实关系的人，比如没有机会接触的公众人物",
          "value": "procul",
          "free_text": false
        },
        {
          "id": "ficto",
          "text": "它主要或只指向虚构角色",
          "value": "ficto",
          "free_text": false
        },
        {
          "id": "auto",
          "text": "它也会指向我自己",
          "value": "auto",
          "free_text": false
        },
        {
          "id": "adex",
          "text": "它只在想象中、不具体的情境里出现，一想到具体的真人就淡了",
          "value": "adex",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-13",
      "title": "时间变化",
      "part": "Q1",
      "measures": "轴 ⑤",
      "enabled_by_default": true,
      "distinguishes": [
        15
      ],
      "response": "单选",
      "stem": "回想自己在不同时期被他人吸引时的经历。哪种描述最接近你的体验？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "稳定",
          "text": "我的感受大体稳定",
          "value": "稳定",
          "free_text": false
        },
        {
          "id": "时强时弱",
          "text": "我会被他人吸引，只是有时强烈，有时微弱",
          "value": "时强时弱",
          "free_text": false
        },
        {
          "id": "flux",
          "text": "有些时期我会被吸引，有些时期则完全不会，这两种状态反复交替出现",
          "value": "flux",
          "free_text": false
        },
        {
          "id": "spike",
          "text": "我大多数时候没有这种感受，但偶尔会突然产生很强烈的心动，并且很快消失",
          "value": "spike",
          "free_text": false
        },
        {
          "id": "没有",
          "text": "我从来没有被他人这样吸引过",
          "value": "没有",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-14",
      "title": "幻想与作品",
      "part": "Q1",
      "measures": "轴 ⑥；1B 中对他人或作品的态度",
      "enabled_by_default": true,
      "distinguishes": [
        7,
        16,
        17,
        45
      ],
      "response": "单选",
      "stem": "对浪漫的幻想、浪漫题材的作品或别人的恋爱故事，哪句更接近你？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "想亲身参与",
          "text": "我喜欢这些，自己也想去经历",
          "value": "想亲身参与",
          "free_text": false
        },
        {
          "id": "脱节",
          "text": "我喜欢看这些，磕 CP 很投入，但我并不想成为故事里的人",
          "value": "脱节",
          "free_text": false
        },
        {
          "id": "无所谓",
          "text": "我对这些无所谓",
          "value": "无所谓",
          "free_text": false
        },
        {
          "id": "回避或排斥",
          "text": "我不太喜欢这些，或者会反感",
          "value": "回避或排斥",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-15",
      "title": "给予与接受",
      "part": "Q1",
      "measures": "轴 ⑧",
      "enabled_by_default": true,
      "distinguishes": [
        46
      ],
      "response": "单选",
      "stem": "浪漫的举动，比如准备惊喜、说情话、送礼物，你更想做给予的一方，还是接受的一方？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "双向",
          "text": "两边我都喜欢",
          "value": "双向",
          "free_text": false
        },
        {
          "id": "只想给予",
          "text": "我更喜欢主动为对方做，不太想接受",
          "value": "只想给予",
          "free_text": false
        },
        {
          "id": "只想接受",
          "text": "我更喜欢对方来为我做，不太想做这些",
          "value": "只想接受",
          "free_text": false
        },
        {
          "id": "都不想",
          "text": "这两种方式我都不太喜欢",
          "value": "都不想",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-16",
      "title": "对自己卷入浪漫的感受",
      "part": "Q1",
      "measures": "1B（对自己）",
      "enabled_by_default": true,
      "distinguishes": [
        18,
        21
      ],
      "response": "单选",
      "stem": "想象自己被追求、和别人有恋人式的互动、被当作恋人对待时，你的感受是？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "排斥",
          "text": "我反感，或者强烈不适",
          "value": "排斥",
          "free_text": false
        },
        {
          "id": "回避",
          "text": "我不希望这样，但不一定反感",
          "value": "回避",
          "free_text": false
        },
        {
          "id": "无所谓",
          "text": "我无所谓",
          "value": "无所谓",
          "free_text": false
        },
        {
          "id": "喜好",
          "text": "我享受，或者乐于参与",
          "value": "喜好",
          "free_text": false
        },
        {
          "id": "矛盾或视情境而定",
          "text": "我的感受要看对象、情境或时候",
          "value": "矛盾或视情境而定",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-17",
      "title": "想不想要恋爱关系",
      "part": "Q1",
      "measures": "1C",
      "enabled_by_default": true,
      "distinguishes": [
        7,
        18,
        30,
        35,
        37,
        46
      ],
      "response": "单选",
      "stem": "你想不想要一段恋爱关系？",
      "note": "这里只问你想不想要这样的关系，和前面问的感受分开记录。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "想要#1",
          "text": "我想要",
          "value": "想要",
          "free_text": false
        },
        {
          "id": "想要#2",
          "text": "我想要，但觉得不太可能",
          "value": "想要",
          "free_text": false
        },
        {
          "id": "想要·较弱",
          "text": "我有点想",
          "value": "想要·较弱",
          "free_text": false
        },
        {
          "id": "无所谓",
          "text": "我无所谓",
          "value": "无所谓",
          "free_text": false
        },
        {
          "id": "不想要",
          "text": "我不太想要",
          "value": "不想要",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-18",
      "title": "浪漫活动",
      "part": "Q1",
      "measures": "bellus 的活动兴趣（2.2）",
      "show_if": {
        "source": "Q1-17 = 不想要",
        "rule": {
          "question": "Q1-17",
          "op": "=",
          "values": [
            "不想要"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        18
      ],
      "response": "单选",
      "stem": "你会喜欢一些带有浪漫氛围的活动吗？比如约会式的出游、烛光晚餐、交换礼物、过纪念日。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "有",
          "text": "有，我喜欢其中一些",
          "value": "有",
          "free_text": false
        },
        {
          "id": "没有",
          "text": "没有，这些我都不太感兴趣",
          "value": "没有",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q1-20",
      "title": "对象不在现实中时的光谱归属",
      "part": "Q1",
      "measures": "光谱归属（9.2）",
      "show_if": {
        "source": "Q1-12 含 {procul、ficto、auto、adex} 且 Q1-12 不含 现实可及 且 Q1-05 未出现",
        "rule": {
          "all": [
            {
              "question": "Q1-12",
              "op": "含",
              "values": [
                "procul",
                "ficto",
                "auto",
                "adex"
              ]
            },
            {
              "question": "Q1-12",
              "op": "不含",
              "values": [
                "现实可及"
              ]
            },
            {
              "question": "Q1-05",
              "op": "未出现"
            }
          ]
        }
      },
      "enabled_by_default": true,
      "response": "单选",
      "stem": "你前面选了这种感受不指向现实中有可能建立关系的人。下面是\"无浪漫光谱\"（aro-spec）的定义，读完后，你会把自己放在这个范围里吗？",
      "note": "感受只指向虚构角色、遥不可及的人或自己时算不算在这个范围里，社群里看法不一，所以请你自己判断。",
      "definitions": [
        {
          "term": "Aro-spec",
          "section": "3.4",
          "text": "很少或不体验浪漫吸引、以有条件或非典型方式体验、与\"浪漫吸引\"这个概念关系复杂，或体验与社会对\"浪漫爱\"的主流期待不一致的人"
        }
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "在光谱内",
          "text": "我会把自己放在里面",
          "value": "在光谱内",
          "free_text": false
        },
        {
          "id": "不在光谱内",
          "text": "我不会把自己放在里面",
          "value": "不在光谱内",
          "free_text": false
        },
        {
          "id": "不想归类",
          "text": "我不想给自己归类",
          "value": "不想归类",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-01",
      "title": "入口",
      "part": "Q2",
      "measures": "—",
      "enabled_by_default": true,
      "response": "单选",
      "stem": "接下来会问到性吸引、性欲，以及你对性方面亲密的想法。题目不会涉及具体的性经历。你可以跳过整个部分，也可以只跳过不想回答的题。",
      "options": [
        {
          "id": "继续",
          "text": "继续",
          "value": "继续",
          "free_text": false
        },
        {
          "id": "跳过这部分",
          "text": "跳过这部分",
          "value": "跳过这部分",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-02",
      "title": "频率与强度",
      "part": "Q2",
      "measures": "轴 ②（2A）",
      "show_if": {
        "source": "Q2-01 = 继续 且 Q0-02 ≠ 不拆分",
        "rule": {
          "all": [
            {
              "question": "Q2-01",
              "op": "=",
              "values": [
                "继续"
              ]
            },
            {
              "question": "Q0-02",
              "op": "≠",
              "values": [
                "不拆分"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        20,
        22
      ],
      "response": "单选",
      "stem": "你有没有对某个特定的人（或角色）产生过想和对方有性接触的渴望？",
      "note": "这里只问你想和某个人有性接触的感觉。单纯的身体反应，或没有具体对象的性冲动不算在内。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "从不",
          "text": "我几乎没有，或者从来没有过",
          "value": "从不",
          "free_text": false
        },
        {
          "id": "极少或很弱",
          "text": "我很少有，或者有但很弱",
          "value": "极少或很弱",
          "free_text": false
        },
        {
          "id": "有时",
          "text": "我有时会有",
          "value": "有时",
          "free_text": false
        },
        {
          "id": "经常",
          "text": "我经常有",
          "value": "经常",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-03",
      "title": "分类方式",
      "part": "Q2",
      "measures": "轴 ①",
      "show_if": {
        "source": "Q2-01 = 继续 且 Q0-02 ≠ 不拆分",
        "rule": {
          "all": [
            {
              "question": "Q2-01",
              "op": "=",
              "values": [
                "继续"
              ]
            },
            {
              "question": "Q0-02",
              "op": "≠",
              "values": [
                "不拆分"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        3,
        4,
        9
      ],
      "response": "单选",
      "stem": "当别人说到“性吸引”—— 想和某个特定的人有性接触的渴望 —— 你能分清它和欣赏外貌、想拥抱亲近，或者一般的性冲动有什么区别吗？",
      "note": "只要你理解它和其他感受的区别，不管自己有没有过这种渴望，都算分得清。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "清楚",
          "text": "我能分清这种渴望和其他感受",
          "value": "清楚",
          "free_text": false
        },
        {
          "id": "有点模糊",
          "text": "我大多分得清，只是偶尔有些模糊",
          "value": "有点模糊",
          "free_text": false
        },
        {
          "id": "无法区分",
          "text": "这些感受在我这里总是混在一起，我分不开",
          "value": "无法区分",
          "free_text": false
        },
        {
          "id": "无法理解",
          "text": "我不理解性吸引究竟是什么感觉，所以也不知道自己有没有",
          "value": "无法理解",
          "free_text": false
        },
        {
          "id": "不适用",
          "text": "我明白这个说法，但它套不到我身上，对我没有意义",
          "value": "不适用",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-04",
      "title": "无性恋光谱归属",
      "part": "Q2",
      "measures": "光谱归属（9.2）",
      "show_if": {
        "source": "Q2-03 ∈ {无法区分、无法理解、不适用}",
        "rule": {
          "question": "Q2-03",
          "op": "∈",
          "values": [
            "无法区分",
            "无法理解",
            "不适用"
          ]
        }
      },
      "enabled_by_default": true,
      "response": "单选",
      "stem": "下面是“无性恋光谱”（ace-spec）的定义。读完后，你觉得自己在这个范围里吗？",
      "definitions": [
        {
          "term": "Ace-spec",
          "section": "4.3",
          "text": "很少或不体验性吸引、以有条件或非典型方式体验，或与\"性吸引\"这个概念关系复杂的人"
        }
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "在光谱内",
          "text": "我会把自己放在里面",
          "value": "在光谱内",
          "free_text": false
        },
        {
          "id": "不在光谱内",
          "text": "我不会把自己放在里面",
          "value": "不在光谱内",
          "free_text": false
        },
        {
          "id": "不想归类",
          "text": "我不想给自己归类",
          "value": "不想归类",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-05",
      "title": "成分与契合感",
      "part": "Q2",
      "measures": "轴 ⑨",
      "show_if": {
        "source": "Q2-03 ∈ {有点模糊、无法区分} 或 Q2-02 ∈ {极少或很弱、有时}",
        "rule": {
          "any": [
            {
              "question": "Q2-03",
              "op": "∈",
              "values": [
                "有点模糊",
                "无法区分"
              ]
            },
            {
              "question": "Q2-02",
              "op": "∈",
              "values": [
                "极少或很弱",
                "有时"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        49
      ],
      "response": "多选",
      "stem": "说到你对某个人的这类渴望与反应，下面哪些描述更贴近你的感受？可以多选。",
      "exclusive": [
        "都不像"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "pseudo·模仿",
          "text": "我觉得这份感觉更像是欣赏对方的外貌、想拥抱或亲近对方",
          "value": "pseudo·模仿",
          "free_text": false
        },
        {
          "id": "pseudo·遮盖",
          "text": "我会被一个人的外貌或其他方面强烈吸引，比如特别想看着对方、拥抱对方，以至于分不清自己有没有想和对方有性接触的渴望",
          "value": "pseudo·遮盖",
          "free_text": false
        },
        {
          "id": "acri",
          "text": "我会有这种渴望，但它让我觉得别扭，和我原本对自己的认识对不上",
          "value": "acri",
          "free_text": false
        },
        {
          "id": "不完整",
          "text": "我有这种渴望，但总觉得少了点什么，和我理解的性吸引不太一样",
          "value": "不完整",
          "free_text": false
        },
        {
          "id": "都不像",
          "text": "这些都不像我",
          "value": "都不像",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-06",
      "title": "性欲",
      "part": "Q2",
      "measures": "2C（4.5）",
      "show_if": {
        "source": "Q2-01 = 继续",
        "rule": {
          "question": "Q2-01",
          "op": "=",
          "values": [
            "继续"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        5,
        23,
        24,
        45
      ],
      "response": "单选",
      "stem": "平时你会有性方面的冲动或欲望吗？如果有，这些欲望通常会指向谁，或者出现在什么情境里？",
      "note": "这里问的是性欲本身。它可以指向某个人，也可以没有具体对象。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "无性欲",
          "text": "我几乎没有这类冲动或欲望",
          "value": "无性欲",
          "free_text": false
        },
        {
          "id": "有·无指向",
          "text": "我有，但它不指向任何人",
          "value": "有·无指向",
          "free_text": false
        },
        {
          "id": "有·指向现实中的人",
          "text": "我有，这种欲望会指向现实中的人",
          "value": "有·指向现实中的人",
          "free_text": false
        },
        {
          "id": "有·指向幻想或虚构",
          "text": "我会有，但主要是在幻想或虚构的情境里",
          "value": "有·指向幻想或虚构",
          "free_text": false
        },
        {
          "id": "波动",
          "text": "我的性欲时有时无，也说不准它会指向哪里",
          "value": "波动",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-07",
      "title": "镜像",
      "part": "Q2",
      "measures": "轴 ③–⑧ 的性侧",
      "show_if": {
        "source": "Q2-01 = 继续 且 Q0-02 ≠ 不拆分",
        "rule": {
          "all": [
            {
              "question": "Q2-01",
              "op": "=",
              "values": [
                "继续"
              ]
            },
            {
              "question": "Q0-02",
              "op": "≠",
              "values": [
                "不拆分"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "response": "逐行",
      "stem": "你之前在浪漫部分回答过一些问题。如果换成性吸引，你的感受和选择还一样吗？请逐条看看。",
      "note": "每一行都会带上你之前的回答；没有答过的题不会出现在这里。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "rows": [
        {
          "id": "③a",
          "text": "产生这种感受时，有没有特别的前提",
          "axis": "③",
          "quotes": {
            "question": "Q1-07"
          },
          "show_if": {
            "source": "Q1-07 不含 {跳过、不确定} 且 Q1-07 不含 demi 且 Q2-02 ≠ 从不",
            "rule": {
              "all": [
                {
                  "question": "Q1-07",
                  "op": "不含",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                },
                {
                  "question": "Q1-07",
                  "op": "不含",
                  "values": [
                    "demi"
                  ]
                },
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                }
              ]
            }
          },
          "ask": "换成想和一个人有性接触的渴望，它出现的前提也是这样吗？",
          "recaps": {
            "无特定条件": "你不需要特别的前提，就会对一个人产生恋爱式的喜欢",
            "demi": "你要先和对方建立很深的情感连接，才会产生恋爱式的喜欢",
            "recip": "你要先知道对方也对你有好感，才可能对对方产生恋爱式的喜欢",
            "apres": "你得先在别的方面对一个人有好感，比如觉得对方好看、想和对方做朋友，才会产生恋爱式的喜欢",
            "fray": "你只在和对方还不熟的时候，才会有恋爱式的喜欢",
            "coeo": "如果刚认识对方时没有恋爱式的喜欢，之后你也不会再有",
            "没有这类经历": "你没有过这类经历"
          }
        },
        {
          "id": "③b",
          "text": "和对方变熟后，感受会不会变淡",
          "axis": "③",
          "quotes": {
            "question": "Q1-09",
            "values": [
              "fray"
            ]
          },
          "show_if": {
            "source": "Q1-09 不含 {跳过、不确定} 且 Q2-02 ≠ 从不",
            "rule": {
              "all": [
                {
                  "question": "Q1-09",
                  "op": "不含",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                },
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                }
              ]
            }
          },
          "ask": "和一个人越来越熟以后，你想和对方有性接触的渴望会变淡吗？",
          "recaps": {
            "fray": "和一个人越熟，你对对方恋爱式的喜欢就越淡",
            "未选": "和一个人变熟，并不会让你对对方恋爱式的喜欢变淡",
            "没有这类经历": "你没有过这类经历"
          },
          "glosses": {
            "fray": {
              "一样": "也会变淡",
              "不一样": "不会变淡"
            },
            "未选": {
              "一样": "也不会变淡",
              "不一样": "会变淡"
            }
          }
        },
        {
          "id": "④a",
          "text": "感受被回应、开始交往后，会有什么变化",
          "axis": "④",
          "quotes": {
            "question": "Q1-09",
            "values": [
              "akoi·回应后消退",
              "akoi·进入关系后消退"
            ]
          },
          "show_if": {
            "source": "Q1-09 不含 {跳过、不确定} 且 Q2-02 ≠ 从不",
            "rule": {
              "all": [
                {
                  "question": "Q1-09",
                  "op": "不含",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                },
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                }
              ]
            }
          },
          "ask": "对方回应了你的渴望，或者你们在一起以后，你想和对方有性接触的渴望会变淡或消失吗？",
          "recaps": {
            "akoi·回应后消退": "知道对方也喜欢你、或者感受被回应以后，你的喜欢会变淡或消失",
            "akoi·进入关系后消退": "在一起以后，你会渐渐对这段关系失去兴趣",
            "未选": "被回应或在一起以后，你的喜欢不会因此变淡",
            "没有这类经历": "你没有过这类经历"
          },
          "glosses": {
            "akoi·回应后消退": {
              "一样": "也会变淡或消失",
              "不一样": "不会"
            },
            "akoi·进入关系后消退": {
              "一样": "也会变淡或消失",
              "不一样": "不会"
            },
            "未选": {
              "一样": "也不会",
              "不一样": "会变淡或消失"
            }
          }
        },
        {
          "id": "④b",
          "text": "有这种感受时，希望对方怎么回应",
          "axis": "④",
          "quotes": {
            "question": "Q1-10"
          },
          "show_if": {
            "source": "Q1-10 ∉ {跳过、不确定} 且 Q2-02 ≠ 从不",
            "rule": {
              "all": [
                {
                  "question": "Q1-10",
                  "op": "∉",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                },
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                }
              ]
            }
          },
          "ask": "换成想和一个人有性接触的渴望，你对回应的期待也是这样吗？",
          "recaps": {
            "希望相互": "有恋爱式的喜欢时，你希望这份感受是相互的",
            "无所谓": "有恋爱式的喜欢时，对方回不回应你都无所谓",
            "akoi·不需要回应": "有恋爱式的喜欢时，你满足于现状，不需要对方回应",
            "akoi·不希望被回应": "有恋爱式的喜欢时，你希望对方千万不要回应"
          }
        },
        {
          "id": "④c",
          "text": "希不希望别人也对你有这种感受",
          "axis": "④",
          "quotes": {
            "question": "Q1-11"
          },
          "show_if": {
            "source": "Q1-11 ∉ {跳过、不确定} 且 Q2-02 ≠ 经常",
            "rule": {
              "all": [
                {
                  "question": "Q1-11",
                  "op": "∉",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                },
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "经常"
                  ]
                }
              ]
            }
          },
          "ask": "换成别人想和你有性接触，你的想法也是这样吗？",
          "recaps": {
            "希望且回应": "你希望别人对你有恋爱式的喜欢，你也会用同样的感情回应",
            "disakoi": "你希望别人对你有恋爱式的喜欢，但你没法对对方产生同样的感情",
            "无所谓": "别人对你有没有恋爱式的喜欢，你都无所谓",
            "不希望": "你不希望别人对你有恋爱式的喜欢"
          }
        },
        {
          "id": "⑤",
          "text": "这种感受会不会随着时间变化",
          "axis": "⑤",
          "quotes": {
            "question": "Q1-13"
          },
          "show_if": {
            "source": "Q1-13 ∉ {跳过、不确定}",
            "rule": {
              "question": "Q1-13",
              "op": "∉",
              "values": [
                "跳过",
                "不确定"
              ]
            }
          },
          "ask": "换成想和一个人有性接触的渴望，它随时间变化的情况也是这样吗？",
          "recaps": {
            "稳定": "你产生恋爱式喜欢的情况大体稳定",
            "时强时弱": "你一直会有恋爱式的喜欢，只是有时强烈、有时微弱",
            "flux": "有些时期你会有恋爱式的喜欢，有些时期完全没有，两种状态反复交替",
            "spike": "你大多数时候没有恋爱式的喜欢，但偶尔会突然很强烈地心动，又很快消失",
            "没有": "你从来没有过恋爱式的喜欢"
          }
        },
        {
          "id": "⑥",
          "text": "对幻想和相关作品的感受",
          "axis": "⑥",
          "quotes": {
            "question": "Q1-14"
          },
          "show_if": {
            "source": "Q1-14 ∉ {跳过、不确定}",
            "rule": {
              "question": "Q1-14",
              "op": "∉",
              "values": [
                "跳过",
                "不确定"
              ]
            }
          },
          "ask": "换成性幻想，或者作品里和性有关的情节，你也是这样吗？",
          "recaps": {
            "想亲身参与": "你喜欢浪漫的幻想和恋爱故事，自己也想去经历",
            "脱节": "你喜欢看恋爱故事、磕 CP 很投入，但并不想成为故事里的人",
            "无所谓": "你对浪漫的幻想和恋爱故事无所谓",
            "回避或排斥": "你不太喜欢浪漫的幻想和恋爱故事，或者会反感"
          }
        },
        {
          "id": "⑦",
          "text": "这种感受通常指向谁",
          "axis": "⑦",
          "quotes": {
            "question": "Q1-12",
            "values": [
              "现实可及",
              "procul",
              "ficto",
              "auto"
            ]
          },
          "show_if": {
            "source": "Q1-12 不含 {跳过、不确定} 且 Q2-02 ≠ 从不",
            "rule": {
              "all": [
                {
                  "question": "Q1-12",
                  "op": "不含",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                },
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                }
              ]
            }
          },
          "ask": "换成想和一个人有性接触的渴望，它指向的对象也是这样吗？",
          "recaps": {
            "现实可及": "你的恋爱式喜欢会指向现实中有可能和你建立关系的人",
            "procul": "你的恋爱式喜欢主要或只指向你明知不可能建立现实关系的人",
            "ficto": "你的恋爱式喜欢主要或只指向虚构角色",
            "auto": "你的恋爱式喜欢也会指向你自己",
            "未选": "你的恋爱式喜欢只在想象中、不具体的情境里出现"
          }
        },
        {
          "id": "⑧",
          "text": "在亲密互动中，更喜欢给予还是接受",
          "axis": "⑧",
          "quotes": {
            "question": "Q1-15"
          },
          "show_if": {
            "source": "Q1-15 ∉ {跳过、不确定}",
            "rule": {
              "question": "Q1-15",
              "op": "∉",
              "values": [
                "跳过",
                "不确定"
              ]
            }
          },
          "ask": "换成性方面的亲密互动，你也是这样吗？",
          "recaps": {
            "双向": "浪漫的举动，给予和接受你都喜欢",
            "只想给予": "浪漫的举动，你更喜欢主动为对方做，不太想接受",
            "只想接受": "浪漫的举动，你更喜欢对方为你做，不太想自己做",
            "都不想": "浪漫的举动，给予和接受你都不太喜欢"
          }
        }
      ],
      "row_options": [
        {
          "id": "一样",
          "text": "一样",
          "value": "一样",
          "free_text": false
        },
        {
          "id": "不一样",
          "text": "不一样",
          "value": "不一样",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-08",
      "title": "展开：前提与熟悉后的变化",
      "part": "Q2",
      "measures": "轴 ③",
      "show_if": {
        "source": "Q2-07[③] ∈ {不一样、不确定} 或 (Q2-02 ≠ 从不 且 (Q1-07 未出现 或 Q1-07 含 {跳过、不确定} 或 Q1-07 含 demi))",
        "rule": {
          "any": [
            {
              "question": "Q2-07",
              "row": "③",
              "op": "∈",
              "values": [
                "不一样",
                "不确定"
              ]
            },
            {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q1-07",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-07",
                      "op": "含",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    },
                    {
                      "question": "Q1-07",
                      "op": "含",
                      "values": [
                        "demi"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        10,
        11,
        12,
        13,
        42,
        43
      ],
      "response": "多选",
      "stem": "你一般会在什么情况下，对某个人产生想和对方有性接触的渴望？可以多选。",
      "exclusive": [
        "无特定条件"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        },
        {
          "value": "没有这类经历",
          "text": "我没有这类经历",
          "handling": "记为信息不足，有线索的子类按 12.1 列为\"可能\"；结果页不写参与者缺什么（第 11 节）"
        }
      ],
      "options": [
        {
          "id": "无特定条件",
          "text": "我不需要什么特别的前提，就可能有这种渴望",
          "value": "无特定条件",
          "free_text": false
        },
        {
          "id": "demi",
          "text": "我需要先和对方建立很深的情感连接，才会有这种渴望；对不熟的人不会有",
          "value": "demi",
          "free_text": false
        },
        {
          "id": "recip",
          "text": "只有知道对方也对我有意，我才可能产生这种渴望",
          "value": "recip",
          "free_text": false
        },
        {
          "id": "apres",
          "text": "我得先从其他方面对一个人产生好感，比如觉得对方好看、想和对方亲近",
          "value": "apres",
          "free_text": false
        },
        {
          "id": "fray",
          "text": "我只在和对方还不熟的时候会有这种渴望，熟悉以后就会变淡",
          "value": "fray",
          "free_text": false
        },
        {
          "id": "coeo",
          "text": "如果刚认识对方时没有这种渴望，后来再熟悉也不会产生",
          "value": "coeo",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-09",
      "title": "展开：回应",
      "part": "Q2",
      "measures": "轴 ④",
      "show_if": {
        "source": "Q2-07[④] ∈ {不一样、不确定} 或 (Q2-02 ≠ 从不 且 (Q1-09 未出现 或 Q1-10 未出现 或 Q1-09 含 {跳过、不确定} 或 Q1-10 ∈ {跳过、不确定})) 或 (Q2-02 ≠ 经常 且 (Q1-11 未出现 或 Q1-11 ∈ {跳过、不确定}))",
        "rule": {
          "any": [
            {
              "question": "Q2-07",
              "row": "④",
              "op": "∈",
              "values": [
                "不一样",
                "不确定"
              ]
            },
            {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q1-09",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-10",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-09",
                      "op": "含",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    },
                    {
                      "question": "Q1-10",
                      "op": "∈",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "经常"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q1-11",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-11",
                      "op": "∈",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        12,
        14,
        46,
        50
      ],
      "response": "多选",
      "stem": "当你对某个人有这样的渴望，或者知道别人对你有类似的渴望时，下面哪些描述符合你？可以多选。",
      "exclusive": [
        "都不像"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        },
        {
          "value": "没有这类经历",
          "text": "我没有这类经历",
          "handling": "记为信息不足，有线索的子类按 12.1 列为\"可能\"；结果页不写参与者缺什么（第 11 节）"
        }
      ],
      "options": [
        {
          "id": "希望相互",
          "text": "我希望对方也对我有同样的渴望",
          "value": "希望相互",
          "free_text": false,
          "show_if": {
            "source": "Q2-02 ≠ 从不 且 (Q2-07[④b] ∈ {不一样、不确定} 或 Q1-10 未出现 或 Q1-10 ∈ {跳过、不确定})",
            "rule": {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q2-07",
                      "row": "④b",
                      "op": "∈",
                      "values": [
                        "不一样",
                        "不确定"
                      ]
                    },
                    {
                      "question": "Q1-10",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-10",
                      "op": "∈",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "id": "无所谓",
          "text": "对方有没有回应，我都无所谓",
          "value": "无所谓",
          "free_text": false,
          "show_if": {
            "source": "Q2-02 ≠ 从不 且 (Q2-07[④b] ∈ {不一样、不确定} 或 Q1-10 未出现 或 Q1-10 ∈ {跳过、不确定})",
            "rule": {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q2-07",
                      "row": "④b",
                      "op": "∈",
                      "values": [
                        "不一样",
                        "不确定"
                      ]
                    },
                    {
                      "question": "Q1-10",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-10",
                      "op": "∈",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "id": "akoi·不需要或不希望被回应",
          "text": "我会有这种渴望，但不需要对方回应，或者希望对方不要回应",
          "value": "akoi·不需要或不希望被回应",
          "free_text": false,
          "show_if": {
            "source": "Q2-02 ≠ 从不 且 (Q2-07[④b] ∈ {不一样、不确定} 或 Q1-10 未出现 或 Q1-10 ∈ {跳过、不确定})",
            "rule": {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q2-07",
                      "row": "④b",
                      "op": "∈",
                      "values": [
                        "不一样",
                        "不确定"
                      ]
                    },
                    {
                      "question": "Q1-10",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-10",
                      "op": "∈",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "id": "akoi·回应后消退",
          "text": "对方回应之后，我的这种渴望会变淡或消失",
          "value": "akoi·回应后消退",
          "free_text": false,
          "show_if": {
            "source": "Q2-02 ≠ 从不 且 (Q2-07[④a] ∈ {不一样、不确定} 或 Q1-09 未出现 或 Q1-09 含 {跳过、不确定})",
            "rule": {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q2-07",
                      "row": "④a",
                      "op": "∈",
                      "values": [
                        "不一样",
                        "不确定"
                      ]
                    },
                    {
                      "question": "Q1-09",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-09",
                      "op": "含",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "id": "disakoi",
          "text": "我希望别人对我有性方面的吸引，但自己没法产生同样的渴望来回应",
          "value": "disakoi",
          "free_text": false,
          "show_if": {
            "source": "Q2-02 ≠ 经常 且 (Q2-07[④c] ∈ {不一样、不确定} 或 Q1-11 未出现 或 Q1-11 ∈ {跳过、不确定})",
            "rule": {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "经常"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q2-07",
                      "row": "④c",
                      "op": "∈",
                      "values": [
                        "不一样",
                        "不确定"
                      ]
                    },
                    {
                      "question": "Q1-11",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-11",
                      "op": "∈",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          "id": "都不像",
          "text": "这些都不像我",
          "value": "都不像",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-10",
      "title": "展开：指向谁",
      "part": "Q2",
      "measures": "轴 ⑦；adexsexual 联动 2A、2C",
      "show_if": {
        "source": "Q2-07[⑦] ∈ {不一样、不确定} 或 (Q2-02 ≠ 从不 且 (Q1-12 未出现 或 Q1-12 含 {跳过、不确定})) 或 (Q2-06 = 有·指向幻想或虚构 且 Q2-02 ∈ {从不、极少或很弱})",
        "rule": {
          "any": [
            {
              "question": "Q2-07",
              "row": "⑦",
              "op": "∈",
              "values": [
                "不一样",
                "不确定"
              ]
            },
            {
              "all": [
                {
                  "question": "Q2-02",
                  "op": "≠",
                  "values": [
                    "从不"
                  ]
                },
                {
                  "any": [
                    {
                      "question": "Q1-12",
                      "op": "未出现"
                    },
                    {
                      "question": "Q1-12",
                      "op": "含",
                      "values": [
                        "跳过",
                        "不确定"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "all": [
                {
                  "question": "Q2-06",
                  "op": "=",
                  "values": [
                    "有·指向幻想或虚构"
                  ]
                },
                {
                  "question": "Q2-02",
                  "op": "∈",
                  "values": [
                    "从不",
                    "极少或很弱"
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        44,
        45
      ],
      "response": "多选",
      "stem": "你产生想和某个人有性接触的渴望，或者性方面的欲望时，这些感受通常指向谁？可以多选。",
      "exclusive": [
        "说不清"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "现实可及",
          "text": "这类渴望或欲望会指向现实中有可能和我建立关系的人",
          "value": "现实可及",
          "free_text": false
        },
        {
          "id": "procul",
          "text": "这种渴望主要或只会指向我明知不可能在现实中建立关系的人",
          "value": "procul",
          "free_text": false
        },
        {
          "id": "ficto",
          "text": "这种渴望主要或只会指向虚构角色",
          "value": "ficto",
          "free_text": false
        },
        {
          "id": "auto",
          "text": "我也会对自己产生这种渴望",
          "value": "auto",
          "free_text": false
        },
        {
          "id": "adex",
          "text": "我会对想象中的性体验有欲望，但一想到现实中具体的某个人，这种欲望就会减弱或消失",
          "value": "adex",
          "free_text": false
        },
        {
          "id": "说不清",
          "text": "这种感觉很模糊，我说不清",
          "value": "说不清",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-11",
      "title": "展开：时间变化",
      "part": "Q2",
      "measures": "轴 ⑤",
      "show_if": {
        "source": "Q2-07[⑤] ∈ {不一样、不确定} 或 (Q2-01 = 继续 且 Q0-02 ≠ 不拆分 且 Q1-13 ∈ {跳过、不确定})",
        "rule": {
          "any": [
            {
              "question": "Q2-07",
              "row": "⑤",
              "op": "∈",
              "values": [
                "不一样",
                "不确定"
              ]
            },
            {
              "all": [
                {
                  "question": "Q2-01",
                  "op": "=",
                  "values": [
                    "继续"
                  ]
                },
                {
                  "question": "Q0-02",
                  "op": "≠",
                  "values": [
                    "不拆分"
                  ]
                },
                {
                  "question": "Q1-13",
                  "op": "∈",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        15
      ],
      "response": "单选",
      "stem": "回想你在不同时期对某个人产生这种渴望的情况，下面哪句更接近你的体验？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "稳定",
          "text": "我产生这种渴望的情况大体稳定",
          "value": "稳定",
          "free_text": false
        },
        {
          "id": "时强时弱",
          "text": "我会有这种渴望，只是有时强烈，有时微弱",
          "value": "时强时弱",
          "free_text": false
        },
        {
          "id": "flux",
          "text": "有些时期我会有这种渴望，有些时期完全没有，这两种状态反复出现",
          "value": "flux",
          "free_text": false
        },
        {
          "id": "spike",
          "text": "大多数时候我没有这种渴望，但偶尔会突然产生很强烈的渴望，而且很快消失",
          "value": "spike",
          "free_text": false
        },
        {
          "id": "没有",
          "text": "我从来没有产生过这种渴望",
          "value": "没有",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-12",
      "title": "展开：幻想与内容",
      "part": "Q2",
      "measures": "轴 ⑥；2B 中对他人或内容的态度",
      "show_if": {
        "source": "Q2-07[⑥] ∈ {不一样、不确定} 或 (Q2-01 = 继续 且 Q0-02 ≠ 不拆分 且 Q1-14 ∈ {跳过、不确定})",
        "rule": {
          "any": [
            {
              "question": "Q2-07",
              "row": "⑥",
              "op": "∈",
              "values": [
                "不一样",
                "不确定"
              ]
            },
            {
              "all": [
                {
                  "question": "Q2-01",
                  "op": "=",
                  "values": [
                    "继续"
                  ]
                },
                {
                  "question": "Q0-02",
                  "op": "≠",
                  "values": [
                    "不拆分"
                  ]
                },
                {
                  "question": "Q1-14",
                  "op": "∈",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        16,
        45
      ],
      "response": "单选",
      "stem": "说到性幻想，或者作品里与性有关的情节，下面哪句更接近你？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "想亲身参与",
          "text": "我对这些感兴趣，也想自己亲身经历",
          "value": "想亲身参与",
          "free_text": false
        },
        {
          "id": "脱节",
          "text": "我会有这方面的幻想，或者对这类内容感兴趣，但不想自己亲身经历",
          "value": "脱节",
          "free_text": false
        },
        {
          "id": "没什么兴趣",
          "text": "我对这些内容没什么兴趣",
          "value": "没什么兴趣",
          "free_text": false
        },
        {
          "id": "排斥",
          "text": "我不太喜欢这些内容，或者会觉得反感",
          "value": "排斥",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-13",
      "title": "展开：给予与接受",
      "part": "Q2",
      "measures": "轴 ⑧",
      "show_if": {
        "source": "Q2-07[⑧] ∈ {不一样、不确定} 或 (Q2-01 = 继续 且 Q0-02 ≠ 不拆分 且 Q1-15 ∈ {跳过、不确定})",
        "rule": {
          "any": [
            {
              "question": "Q2-07",
              "row": "⑧",
              "op": "∈",
              "values": [
                "不一样",
                "不确定"
              ]
            },
            {
              "all": [
                {
                  "question": "Q2-01",
                  "op": "=",
                  "values": [
                    "继续"
                  ]
                },
                {
                  "question": "Q0-02",
                  "op": "≠",
                  "values": [
                    "不拆分"
                  ]
                },
                {
                  "question": "Q1-15",
                  "op": "∈",
                  "values": [
                    "跳过",
                    "不确定"
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        46
      ],
      "response": "单选",
      "stem": "在性方面的亲密互动中，你更喜欢主动给予，还是接受对方的亲密？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "双向",
          "text": "两边我都喜欢",
          "value": "双向",
          "free_text": false
        },
        {
          "id": "只想给予",
          "text": "我更喜欢主动给予，不太想接受",
          "value": "只想给予",
          "free_text": false
        },
        {
          "id": "只想接受",
          "text": "我更喜欢接受，不太想主动给予",
          "value": "只想接受",
          "free_text": false
        },
        {
          "id": "都不想",
          "text": "这两种方式我都不太喜欢",
          "value": "都不想",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-14",
      "title": "对自己参与的感受",
      "part": "Q2",
      "measures": "2B（对自己）",
      "show_if": {
        "source": "Q2-01 = 继续",
        "rule": {
          "question": "Q2-01",
          "op": "=",
          "values": [
            "继续"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        20,
        24,
        25
      ],
      "response": "单选",
      "stem": "想到自己和别人有性方面的亲密接触时，你是什么感受？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "排斥",
          "text": "我反感，或者强烈不适",
          "value": "排斥",
          "free_text": false
        },
        {
          "id": "回避",
          "text": "我不想参与，但不一定反感",
          "value": "回避",
          "free_text": false
        },
        {
          "id": "无所谓",
          "text": "我没什么特别的感觉",
          "value": "无所谓",
          "free_text": false
        },
        {
          "id": "喜好",
          "text": "我会享受这样的亲密，或者乐于参与",
          "value": "喜好",
          "free_text": false
        },
        {
          "id": "矛盾或视情境而定",
          "text": "我的感受会因对象、情境或时间而不同",
          "value": "矛盾或视情境而定",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-15",
      "title": "想不想要包含性的关系",
      "part": "Q2",
      "measures": "2D",
      "show_if": {
        "source": "Q2-01 = 继续",
        "rule": {
          "question": "Q2-01",
          "op": "=",
          "values": [
            "继续"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        7,
        46
      ],
      "response": "单选",
      "stem": "你想不想和别人建立一段包含性方面亲密的关系？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "想要",
          "text": "我想要",
          "value": "想要",
          "free_text": false
        },
        {
          "id": "想要·较弱",
          "text": "我有点想",
          "value": "想要·较弱",
          "free_text": false
        },
        {
          "id": "无所谓",
          "text": "我无所谓",
          "value": "无所谓",
          "free_text": false
        },
        {
          "id": "不想要#1",
          "text": "我不太想要",
          "value": "不想要",
          "free_text": false
        },
        {
          "id": "不想要#2",
          "text": "我不想要",
          "value": "不想要",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-16",
      "title": "与性有关的兴趣",
      "part": "Q2",
      "measures": "bellussexual（2.2）",
      "show_if": {
        "source": "Q2-15 = 不想要 且 (Q2-02 = 从不 或 (Q0-02 = 不拆分 且 (Q1-02 = 从不 或 Q1-21 = 确定没有过)))",
        "rule": {
          "all": [
            {
              "question": "Q2-15",
              "op": "=",
              "values": [
                "不想要"
              ]
            },
            {
              "any": [
                {
                  "question": "Q2-02",
                  "op": "=",
                  "values": [
                    "从不"
                  ]
                },
                {
                  "all": [
                    {
                      "question": "Q0-02",
                      "op": "=",
                      "values": [
                        "不拆分"
                      ]
                    },
                    {
                      "any": [
                        {
                          "question": "Q1-02",
                          "op": "=",
                          "values": [
                            "从不"
                          ]
                        },
                        {
                          "question": "Q1-21",
                          "op": "=",
                          "values": [
                            "确定没有过"
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "response": "单选",
      "stem": "你对某些与性有关的活动或体验感兴趣吗？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "有",
          "text": "有，其中有一些我感兴趣",
          "value": "有",
          "free_text": false
        },
        {
          "id": "没有",
          "text": "没有，我对这些都不太感兴趣",
          "value": "没有",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q2-17",
      "title": "对象不在现实中时的光谱归属",
      "part": "Q2",
      "measures": "光谱归属（9.2）",
      "show_if": {
        "source": "Q2-04 未出现 且 Q2-02 ≠ 从不 且 ((Q2-10 含 {procul、ficto、auto、adex} 且 Q2-10 不含 现实可及) 或 (Q2-07[⑦] = 一样 且 Q1-12 含 {procul、ficto、auto} 且 Q1-12 不含 现实可及))",
        "rule": {
          "all": [
            {
              "question": "Q2-04",
              "op": "未出现"
            },
            {
              "question": "Q2-02",
              "op": "≠",
              "values": [
                "从不"
              ]
            },
            {
              "any": [
                {
                  "all": [
                    {
                      "question": "Q2-10",
                      "op": "含",
                      "values": [
                        "procul",
                        "ficto",
                        "auto",
                        "adex"
                      ]
                    },
                    {
                      "question": "Q2-10",
                      "op": "不含",
                      "values": [
                        "现实可及"
                      ]
                    }
                  ]
                },
                {
                  "all": [
                    {
                      "question": "Q2-07",
                      "row": "⑦",
                      "op": "=",
                      "values": [
                        "一样"
                      ]
                    },
                    {
                      "question": "Q1-12",
                      "op": "含",
                      "values": [
                        "procul",
                        "ficto",
                        "auto"
                      ]
                    },
                    {
                      "question": "Q1-12",
                      "op": "不含",
                      "values": [
                        "现实可及"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "response": "单选",
      "stem": "你前面提到，这种渴望并不指向现实中可能和你建立关系的人。读完下面“无性恋光谱”（ace-spec）的定义，你觉得自己在这个范围里吗？",
      "note": "如果你的渴望只指向虚构角色、现实中无法接近的人或自己，或者只在想象里出现，是否属于这个范围，社群里有不同看法。你可以按自己的理解来选。",
      "definitions": [
        {
          "term": "Ace-spec",
          "section": "4.3",
          "text": "很少或不体验性吸引、以有条件或非典型方式体验，或与\"性吸引\"这个概念关系复杂的人"
        }
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "在光谱内",
          "text": "我会把自己放在里面",
          "value": "在光谱内",
          "free_text": false
        },
        {
          "id": "不在光谱内",
          "text": "我不会把自己放在里面",
          "value": "不在光谱内",
          "free_text": false
        },
        {
          "id": "不想归类",
          "text": "我不想给自己归类",
          "value": "不想归类",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q3-01",
      "title": "柏拉图吸引",
      "part": "Q3",
      "measures": "3A",
      "enabled_by_default": true,
      "distinguishes": [
        1
      ],
      "response": "单选",
      "stem": "你有没有对某个特定的人产生过这样的想法：特别想和对方成为朋友，变得更亲近？",
      "description_template": "我{}对某个特定的人产生想成为朋友、更加亲近的愿望",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "几乎没有",
          "text": "几乎不会",
          "value": "几乎没有",
          "free_text": false
        },
        {
          "id": "很少",
          "text": "很少",
          "value": "很少",
          "free_text": false
        },
        {
          "id": "有时",
          "text": "有时",
          "value": "有时",
          "free_text": false
        },
        {
          "id": "经常",
          "text": "经常",
          "value": "经常",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q3-02",
      "title": "感官吸引",
      "part": "Q3",
      "measures": "3B",
      "enabled_by_default": true,
      "distinguishes": [
        3
      ],
      "response": "单选",
      "stem": "你有没有很想和某个拥抱、依偎或牵手的时候？",
      "note": "这里指的是不涉及性的身体亲近。",
      "description_template": "我{}想和某个特定的人拥抱、依偎或牵手，进行非性的身体接触",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "几乎没有",
          "text": "几乎不会",
          "value": "几乎没有",
          "free_text": false
        },
        {
          "id": "很少",
          "text": "很少",
          "value": "很少",
          "free_text": false
        },
        {
          "id": "有时",
          "text": "有时",
          "value": "有时",
          "free_text": false
        },
        {
          "id": "经常",
          "text": "经常",
          "value": "经常",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q3-03",
      "title": "审美吸引",
      "part": "Q3",
      "measures": "3C",
      "enabled_by_default": true,
      "distinguishes": [
        4,
        47
      ],
      "response": "单选",
      "stem": "你会不会因为某个人很好看而感觉 ta 特别有魅力，忍不住欣赏？",
      "description_template": "我{}被某个人的外貌或气质吸引，想多看几眼、欣赏对方",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "几乎没有",
          "text": "几乎不会",
          "value": "几乎没有",
          "free_text": false
        },
        {
          "id": "很少",
          "text": "很少",
          "value": "很少",
          "free_text": false
        },
        {
          "id": "有时",
          "text": "有时",
          "value": "有时",
          "free_text": false
        },
        {
          "id": "经常",
          "text": "经常",
          "value": "经常",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q3-04",
      "title": "最想亲近的时候",
      "part": "Q3",
      "measures": "3D；轴 ① 复核",
      "enabled_by_default": true,
      "distinguishes": [
        1,
        2,
        49
      ],
      "response": "多选",
      "stem": "当你特别想和某个人亲近的时候，你会怎样形容那种想亲近的感觉？",
      "exclusive": [
        "没有过"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "恋爱式",
          "text": "更像恋爱式的喜欢",
          "value": "恋爱式",
          "free_text": false
        },
        {
          "id": "朋友式",
          "text": "更像朋友式的喜欢",
          "value": "朋友式",
          "free_text": false
        },
        {
          "id": "别样吸引#1",
          "text": "那种喜欢介于恋爱和友谊之间",
          "value": "别样吸引",
          "free_text": false
        },
        {
          "id": "别样吸引#2",
          "text": "那既不是恋爱式的喜欢，也不是朋友式的喜欢，而是另一种感受",
          "value": "别样吸引",
          "free_text": false
        },
        {
          "id": "没有过",
          "text": "我没有过特别想和某个人亲近的感觉",
          "value": "没有过",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q3-05",
      "title": "情感连接",
      "part": "Q3",
      "measures": "3D（情感吸引）",
      "enabled_by_default": true,
      "distinguishes": [
        2
      ],
      "response": "单选",
      "stem": "你有没有特别想和某个人建立很深的情感联系？比如，想和对方彼此理解、分享心事，在需要时相互支持。这种联系不一定是恋爱。",
      "description_template": "我{}特别想和某个人建立很深的情感联系",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "几乎没有",
          "text": "几乎不会",
          "value": "几乎没有",
          "free_text": false
        },
        {
          "id": "很少",
          "text": "很少",
          "value": "很少",
          "free_text": false
        },
        {
          "id": "有时",
          "text": "有时",
          "value": "有时",
          "free_text": false
        },
        {
          "id": "经常",
          "text": "经常",
          "value": "经常",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q3-06",
      "title": "智性吸引",
      "part": "Q3",
      "measures": "3E（可选）",
      "enabled_by_default": true,
      "response": "单选",
      "stem": "你有没有觉得某个人的想法、谈吐或见识很吸引你？",
      "description_template": "我{}被某个人的想法、谈吐、见识吸引",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "几乎没有",
          "text": "几乎不会",
          "value": "几乎没有",
          "free_text": false
        },
        {
          "id": "很少",
          "text": "很少",
          "value": "很少",
          "free_text": false
        },
        {
          "id": "有时",
          "text": "有时",
          "value": "有时",
          "free_text": false
        },
        {
          "id": "经常",
          "text": "经常",
          "value": "经常",
          "free_text": false
        }
      ]
    },
    {
      "id": "QM-01",
      "title": "入口",
      "part": "QM",
      "measures": "—",
      "enabled_by_default": true,
      "response": "单选",
      "stem": "要不要标注你的吸引指向哪些性别？这一部分可选，结果只放在\"你可能也会想了解\"里，由你决定要不要加进结果卡。",
      "options": [
        {
          "id": "要",
          "text": "要",
          "value": "要",
          "free_text": false
        },
        {
          "id": "不标注",
          "text": "跳过这部分",
          "value": "不标注",
          "free_text": false
        }
      ]
    },
    {
      "id": "QM-02",
      "title": "浪漫吸引的指向",
      "part": "QM",
      "measures": "1D",
      "show_if": {
        "source": "QM-01 = 要",
        "rule": {
          "question": "QM-01",
          "op": "=",
          "values": [
            "要"
          ]
        }
      },
      "enabled_by_default": true,
      "response": "多选或自填",
      "stem": "你会用哪些词描述浪漫吸引（或想象中的浪漫吸引）指向的性别？可以多选。",
      "note": "如果你在开头选了浪漫和性分不开，这里指你那种不分浪漫和性的吸引，下一题不再单独问。",
      "exclusive": [
        "无方向",
        "不适用",
        "不想标注"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "异性浪漫",
          "text": "异性浪漫（heteroromantic）：指向与我不同的性别",
          "value": "异性浪漫",
          "free_text": false
        },
        {
          "id": "同性浪漫",
          "text": "同性浪漫（homoromantic）：指向与我相同的性别",
          "value": "同性浪漫",
          "free_text": false
        },
        {
          "id": "双性浪漫",
          "text": "双性浪漫（biromantic）：指向两种或更多性别",
          "value": "双性浪漫",
          "free_text": false
        },
        {
          "id": "泛性浪漫",
          "text": "泛性浪漫（panromantic）：可以指向任何性别，性别不是决定因素",
          "value": "泛性浪漫",
          "free_text": false
        },
        {
          "id": "多性浪漫",
          "text": "多性浪漫（polyromantic）：指向多种、但不是所有性别",
          "value": "多性浪漫",
          "free_text": false
        },
        {
          "id": "其他",
          "text": "其他，我想自己填写",
          "value": "其他",
          "free_text": true
        },
        {
          "id": "无方向",
          "text": "无方向：我说不出它指向哪些性别",
          "value": "无方向",
          "free_text": false
        },
        {
          "id": "不适用",
          "text": "不适用：这个问题对我不适用",
          "value": "不适用",
          "free_text": false
        },
        {
          "id": "不想标注",
          "text": "不想标注",
          "value": "不想标注",
          "free_text": false
        }
      ]
    },
    {
      "id": "QM-03",
      "title": "性吸引的指向",
      "part": "QM",
      "measures": "2E",
      "show_if": {
        "source": "QM-01 = 要 且 Q2-01 = 继续 且 Q0-02 ≠ 不拆分",
        "rule": {
          "all": [
            {
              "question": "QM-01",
              "op": "=",
              "values": [
                "要"
              ]
            },
            {
              "question": "Q2-01",
              "op": "=",
              "values": [
                "继续"
              ]
            },
            {
              "question": "Q0-02",
              "op": "≠",
              "values": [
                "不拆分"
              ]
            }
          ]
        }
      },
      "enabled_by_default": true,
      "response": "多选或自填",
      "stem": "你会用哪些词描述性吸引（或想象中的性吸引）指向的性别？可以多选。",
      "exclusive": [
        "无方向",
        "不适用",
        "不想标注"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "异性",
          "text": "异性恋（heterosexual）：指向与我不同的性别",
          "value": "异性",
          "free_text": false
        },
        {
          "id": "同性",
          "text": "同性恋（gay、lesbian 等）：指向与我相同的性别",
          "value": "同性",
          "free_text": false
        },
        {
          "id": "双性",
          "text": "双性恋（bisexual）：指向两种或更多性别",
          "value": "双性",
          "free_text": false
        },
        {
          "id": "泛性",
          "text": "泛性恋（pansexual）：可以指向任何性别，性别不是决定因素",
          "value": "泛性",
          "free_text": false
        },
        {
          "id": "多性",
          "text": "多性恋（polysexual）：指向多种、但不是所有性别",
          "value": "多性",
          "free_text": false
        },
        {
          "id": "其他",
          "text": "其他，我想自己填写",
          "value": "其他",
          "free_text": true
        },
        {
          "id": "无方向",
          "text": "无方向：我说不出它指向哪些性别",
          "value": "无方向",
          "free_text": false
        },
        {
          "id": "不适用",
          "text": "不适用：这个问题对我不适用",
          "value": "不适用",
          "free_text": false
        },
        {
          "id": "不想标注",
          "text": "不想标注",
          "value": "不想标注",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q4-01",
      "title": "想要的关系",
      "part": "Q4",
      "measures": "4A",
      "enabled_by_default": true,
      "distinguishes": [
        30,
        36,
        37
      ],
      "response": "多选并排序",
      "stem": "如果可以按照自己的心意选择，你会想要下面哪些关系？可以多选，也可以把最想要的排在前面。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "浪漫伴侣关系",
          "text": "浪漫伴侣关系：彼此把对方当作恋人，以恋爱为核心的伴侣关系",
          "value": "浪漫伴侣关系",
          "free_text": false
        },
        {
          "id": "QPR",
          "text": "酷儿柏拉图关系（QPR）：不以恋爱为核心，也可能不按“恋爱／友谊”来划分；可以有深厚的亲密、承诺或共同生活，具体由当事人决定",
          "value": "QPR",
          "free_text": false
        },
        {
          "id": "柏拉图伴侣",
          "text": "柏拉图伴侣或柏拉图式生活伴侣：彼此明确把这段关系理解为柏拉图式的，同时像伴侣一样相互承诺，比如一起生活、规划未来",
          "value": "柏拉图伴侣",
          "free_text": false
        },
        {
          "id": "亲密友谊",
          "text": "亲密友谊或承诺式友谊：彼此很重要，也可能有深厚的亲密和长期承诺，但双方仍把这段关系理解为友谊",
          "value": "亲密友谊",
          "free_text": false
        },
        {
          "id": "选择的家人",
          "text": "选择的家人或亲密社群网络：由几段亲密关系组成，大家彼此照顾、相互支持，而不依靠某一个伴侣",
          "value": "选择的家人",
          "free_text": false
        },
        {
          "id": "以性为主的非浪漫关系",
          "text": "以性为主的非浪漫关系：有性方面的亲密，但不包含浪漫内容的关系",
          "value": "以性为主的非浪漫关系",
          "free_text": false,
          "show_if": {
            "source": "Q2-01 = 继续",
            "rule": {
              "question": "Q2-01",
              "op": "=",
              "values": [
                "继续"
              ]
            }
          }
        },
        {
          "id": "不寻求伴侣式关系",
          "text": "我不想要伴侣式的关系",
          "value": "不寻求伴侣式关系",
          "free_text": false
        },
        {
          "id": "未定",
          "text": "我还没想好，想顺其自然",
          "value": "未定",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q4-02",
      "title": "怎样理解伴侣关系",
      "part": "Q4",
      "measures": "4A 细分",
      "show_if": {
        "source": "Q4-01 含 {浪漫伴侣关系、QPR、柏拉图伴侣}",
        "rule": {
          "question": "Q4-01",
          "op": "含",
          "values": [
            "浪漫伴侣关系",
            "QPR",
            "柏拉图伴侣"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        27,
        28
      ],
      "response": "单选",
      "stem": "想到你想要的伴侣关系，下面哪种说法更接近你对这段关系的理解？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "浪漫伴侣关系",
          "text": "我会把它理解为恋爱关系",
          "value": "浪漫伴侣关系",
          "free_text": false
        },
        {
          "id": "QPR·超出友谊",
          "text": "我会把它理解为一种比一般友谊更亲密、但不是恋爱的关系",
          "value": "QPR·超出友谊",
          "free_text": false
        },
        {
          "id": "QPR·不划分",
          "text": "我不想用“恋爱”或“友谊”来划分我们之间的关系",
          "value": "QPR·不划分",
          "free_text": false
        },
        {
          "id": "柏拉图伴侣",
          "text": "我会把它当作柏拉图式的伴侣关系",
          "value": "柏拉图伴侣",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q4-03",
      "title": "承诺与生活交织",
      "part": "Q4",
      "measures": "是否超出友谊常规；有无承诺与生活交织",
      "show_if": {
        "source": "Q4-01 含 {QPR、柏拉图伴侣、亲密友谊、以性为主的非浪漫关系}",
        "rule": {
          "question": "Q4-01",
          "op": "含",
          "values": [
            "QPR",
            "柏拉图伴侣",
            "亲密友谊",
            "以性为主的非浪漫关系"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        29,
        31
      ],
      "response": "逐行",
      "stem": "对于你选中的每一种关系，你希望其中包含长期承诺、彼此优先，或者一起生活吗？请分别选择。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "rows": [
        {
          "id": "QPR",
          "text": "酷儿柏拉图关系（QPR）",
          "show_if": {
            "source": "Q4-01 含 QPR",
            "rule": {
              "question": "Q4-01",
              "op": "含",
              "values": [
                "QPR"
              ]
            }
          }
        },
        {
          "id": "柏拉图伴侣",
          "text": "柏拉图伴侣或柏拉图式生活伴侣",
          "show_if": {
            "source": "Q4-01 含 柏拉图伴侣",
            "rule": {
              "question": "Q4-01",
              "op": "含",
              "values": [
                "柏拉图伴侣"
              ]
            }
          }
        },
        {
          "id": "亲密友谊",
          "text": "亲密友谊或承诺式友谊",
          "show_if": {
            "source": "Q4-01 含 亲密友谊",
            "rule": {
              "question": "Q4-01",
              "op": "含",
              "values": [
                "亲密友谊"
              ]
            }
          }
        },
        {
          "id": "以性为主的非浪漫关系",
          "text": "以性为主的非浪漫关系",
          "show_if": {
            "source": "Q4-01 含 以性为主的非浪漫关系",
            "rule": {
              "question": "Q4-01",
              "op": "含",
              "values": [
                "以性为主的非浪漫关系"
              ]
            }
          }
        }
      ],
      "row_options": [
        {
          "id": "会",
          "text": "会",
          "value": "会",
          "free_text": false
        },
        {
          "id": "部分会",
          "text": "部分会",
          "value": "部分会",
          "free_text": false
        },
        {
          "id": "不会",
          "text": "不会",
          "value": "不会",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q4-04",
      "title": "关系元素",
      "part": "Q4",
      "measures": "4B",
      "enabled_by_default": true,
      "distinguishes": [
        25,
        29,
        33,
        37
      ],
      "response": "逐行",
      "stem": "在你理想中的重要关系里，下面这些相处方式或生活安排，你想要吗？请逐项选择。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "rows": [
        {
          "id": "倾诉支持",
          "text": "能彼此倾诉心事，在需要时相互支持",
          "category": "情感",
          "element": "深度倾诉与情感支持"
        },
        {
          "id": "最重要的人",
          "text": "彼此是最重要的人之一",
          "category": "情感",
          "element": "彼此是最重要的人之一"
        },
        {
          "id": "第一联系人",
          "text": "遇到紧急情况时，彼此是最先联系的人",
          "category": "情感",
          "element": "危机时的第一联系人"
        },
        {
          "id": "非性肢体亲密",
          "text": "拥抱、依偎、牵手、同床睡觉等非性的身体亲密",
          "category": "身体",
          "element": "非性的肢体亲密（拥抱、依偎、牵手、同床而眠）"
        },
        {
          "id": "性",
          "text": "性方面的亲密",
          "category": "身体",
          "element": "性",
          "show_if": {
            "source": "Q2-01 = 继续",
            "rule": {
              "question": "Q2-01",
              "op": "=",
              "values": [
                "继续"
              ]
            }
          }
        },
        {
          "id": "浪漫表达",
          "text": "做浪漫的事、过纪念日、用恋人式的称呼，或者保留一些“在一起”的仪式感",
          "category": "浪漫表达",
          "element": "浪漫举动、纪念日、恋人式称呼、\"在一起\"的仪式感"
        },
        {
          "id": "同居",
          "text": "住在一起",
          "category": "生活",
          "element": "同居"
        },
        {
          "id": "共同日常",
          "text": "一起做饭、做家务，分享日常生活",
          "category": "生活",
          "element": "共同的日常（做饭、家务）"
        },
        {
          "id": "一起旅行",
          "text": "一起旅行",
          "category": "生活",
          "element": "一起旅行"
        },
        {
          "id": "共同财务",
          "text": "共同管理财务",
          "category": "经济",
          "element": "共同财务"
        },
        {
          "id": "共同置业",
          "text": "一起置业，比如买房",
          "category": "经济",
          "element": "共同置业"
        },
        {
          "id": "婚姻",
          "text": "结婚",
          "category": "法律与制度",
          "element": "婚姻"
        },
        {
          "id": "其他法律安排",
          "text": "为彼此做法律上的安排，比如遗嘱、医疗决定授权",
          "category": "法律与制度",
          "element": "其他法律安排（遗嘱、医疗决定授权等）"
        },
        {
          "id": "长期规划",
          "text": "一起做长期规划",
          "category": "未来",
          "element": "长期规划"
        },
        {
          "id": "共同养育孩子",
          "text": "一起养育孩子",
          "category": "未来",
          "element": "共同养育孩子"
        },
        {
          "id": "共同养宠物",
          "text": "一起养宠物",
          "category": "未来",
          "element": "共同养宠物"
        },
        {
          "id": "一起养老",
          "text": "一起养老",
          "category": "未来",
          "element": "一起养老"
        },
        {
          "id": "对外公开",
          "text": "向别人公开这段关系，用彼此认可的称呼介绍对方",
          "category": "社会",
          "element": "对外公开，以特定称谓介绍彼此"
        },
        {
          "id": "融入家庭",
          "text": "融入对方的家庭",
          "category": "社会",
          "element": "融入对方的家庭"
        }
      ],
      "row_options": [
        {
          "id": "想要",
          "text": "想要",
          "value": "想要",
          "free_text": false
        },
        {
          "id": "可以接受",
          "text": "可以接受",
          "value": "可以接受",
          "free_text": false
        },
        {
          "id": "不要",
          "text": "不要",
          "value": "不要",
          "free_text": false
        },
        {
          "id": "视对象而定",
          "text": "视对象而定",
          "value": "视对象而定",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q5-01",
      "title": "排他与数量",
      "part": "Q5",
      "measures": "5A",
      "enabled_by_default": true,
      "distinguishes": [
        32,
        33,
        38,
        39
      ],
      "response": "单选",
      "stem": "理想中，你希望伴侣关系是一对一、彼此排他的，还是可以同时拥有多段关系？",
      "note": "这里说的伴侣关系不一定是恋爱，也可以是其他形式的伴侣关系。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "单偶",
          "text": "我希望只有一段伴侣关系，彼此排他",
          "value": "单偶",
          "free_text": false
        },
        {
          "id": "非单偶",
          "text": "我希望可以同时有多段，相关的人都知情同意",
          "value": "非单偶",
          "free_text": false
        },
        {
          "id": "两可",
          "text": "一段也好，多段也好，我都能接受",
          "value": "两可",
          "free_text": false
        },
        {
          "id": "不适用",
          "text": "我不寻求伴侣式的关系",
          "value": "不适用",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q5-02",
      "title": "多段关系的安排",
      "part": "Q5",
      "measures": "5A 细分",
      "show_if": {
        "source": "Q5-01 ∈ {非单偶、两可}",
        "rule": {
          "question": "Q5-01",
          "op": "∈",
          "values": [
            "非单偶",
            "两可"
          ]
        }
      },
      "enabled_by_default": true,
      "distinguishes": [
        34
      ],
      "response": "多选或自填",
      "stem": "如果你可以同时拥有不止一段伴侣关系，你希望它们是什么样的？可以多选。",
      "exclusive": [
        "未定"
      ],
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "多元之爱",
          "text": "我希望可以同时和不止一个人建立有感情或承诺的伴侣关系。",
          "value": "多元之爱",
          "free_text": false
        },
        {
          "id": "开放式关系",
          "text": "我希望有一段核心的伴侣关系，也可以在彼此商量同意后，和其他人有性方面的亲密。",
          "value": "开放式关系",
          "free_text": false
        },
        {
          "id": "逐段决定",
          "text": "我不想事先规定每段关系应该是什么样，想根据具体的人和关系来决定。",
          "value": "逐段决定",
          "free_text": false
        },
        {
          "id": "其他",
          "text": "我想要其他形式的安排",
          "value": "其他",
          "free_text": true
        },
        {
          "id": "未定",
          "text": "我还没想好。",
          "value": "未定",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q5-03",
      "title": "主次",
      "part": "Q5",
      "measures": "5B",
      "enabled_by_default": true,
      "distinguishes": [
        32,
        33,
        35
      ],
      "response": "单选",
      "stem": "如果你和好几个人都有重要的关系（伴侣、朋友、家人都算），你会怎样看待这些关系之间的主次？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "预设主次",
          "text": "我会提前规定哪些关系更优先",
          "value": "预设主次",
          "free_text": false
        },
        {
          "id": "自然形成的优先",
          "text": "关系自然会有亲疏，但我不提前规定主次",
          "value": "自然形成的优先",
          "free_text": false
        },
        {
          "id": "不分等级",
          "text": "我不会给这些关系排高低",
          "value": "不分等级",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q5-04",
      "title": "关系类别",
      "part": "Q5",
      "measures": "5C",
      "enabled_by_default": true,
      "distinguishes": [
        32,
        33,
        35
      ],
      "response": "单选",
      "stem": "在你看来，恋爱关系和友谊之间，有没有哪一类通常更重要？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "是",
          "text": "我觉得恋爱关系通常比友谊更重要",
          "value": "是",
          "free_text": false
        },
        {
          "id": "友谊更重要",
          "text": "我通常会更看重友谊",
          "value": "友谊更重要",
          "free_text": false
        },
        {
          "id": "不预设",
          "text": "我不会仅凭关系类别判断重要性，要看具体的人和关系",
          "value": "不预设",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q5-05",
      "title": "约定从哪来",
      "part": "Q5",
      "measures": "5D",
      "enabled_by_default": true,
      "distinguishes": [
        32,
        33,
        35
      ],
      "response": "单选",
      "stem": "对于恋人、朋友或其他亲密关系中常见的相处规则，你通常是什么态度？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "社会默认模板",
          "text": "我倾向于遵循大家习惯的相处方式",
          "value": "社会默认模板",
          "free_text": false
        },
        {
          "id": "协商",
          "text": "我会参考常见的相处方式，再和对方商量哪些适合我们",
          "value": "协商",
          "free_text": false
        },
        {
          "id": "逐项定制",
          "text": "我更希望由彼此决定怎么相处，不需要以常见规则为前提。",
          "value": "逐项定制",
          "free_text": false
        },
        {
          "id": "视事情而定",
          "text": "要看具体是什么事情，我没有固定的倾向。",
          "value": "视事情而定",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q5-06",
      "title": "关系路径",
      "part": "Q5",
      "measures": "5E",
      "enabled_by_default": true,
      "response": "单选",
      "stem": "有一种常见的亲密关系发展路线：先约会、确定关系，之后可能同居、结婚、一起养育孩子。你希望自己的关系也照着这条路线发展吗？",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "期望遵循",
          "text": "我希望大致按这条路走",
          "value": "期望遵循",
          "free_text": false
        },
        {
          "id": "选择性",
          "text": "我只想选择其中一部分",
          "value": "选择性",
          "free_text": false
        },
        {
          "id": "离开关系电梯",
          "text": "我不想照着这条路线发展",
          "value": "离开关系电梯",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q5-07",
      "title": "一种常见说法",
      "part": "Q5",
      "measures": "恋爱规范性批判（8.3 的价值题）",
      "enabled_by_default": true,
      "distinguishes": [
        35
      ],
      "response": "单选",
      "stem": "有人认为：“有一段长期、稳定的恋爱关系或婚姻，生活会更好。”你怎么看？",
      "description_template": "对于“对大多数人来说，有一段长期、稳定的恋爱关系或婚姻，生活会更好”这句话，{}",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "同意",
          "text": "我同意",
          "value": "同意",
          "free_text": false
        },
        {
          "id": "部分同意",
          "text": "我部分同意",
          "value": "部分同意",
          "free_text": false
        },
        {
          "id": "不同意",
          "text": "我不同意",
          "value": "不同意",
          "free_text": false
        }
      ]
    },
    {
      "id": "Q5-08",
      "title": "现在的关系状况",
      "part": "Q5",
      "measures": "不计分",
      "enabled_by_default": false,
      "distinguishes": [
        39
      ],
      "response": "单选或自填",
      "stem": "你现在有伴侣式的关系吗？这道题只用来了解你的现状，不影响测试结果。",
      "exits": [
        {
          "value": "跳过",
          "text": "跳过这题",
          "handling": "记为缺失"
        },
        {
          "value": "不确定",
          "text": "我不确定",
          "handling": "体验本身说不清，记为缺失"
        }
      ],
      "options": [
        {
          "id": "无伴侣",
          "text": "我目前没有伴侣式的关系",
          "value": "无伴侣",
          "free_text": false
        },
        {
          "id": "一段",
          "text": "我目前有一段伴侣式的关系",
          "value": "一段",
          "free_text": false
        },
        {
          "id": "多段",
          "text": "我目前有多段伴侣式的关系",
          "value": "多段",
          "free_text": false
        },
        {
          "id": "自填",
          "text": "我想自己描述",
          "value": "自填",
          "free_text": true
        }
      ]
    }
  ]
};
